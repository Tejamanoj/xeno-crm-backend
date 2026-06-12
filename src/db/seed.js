import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "../../crm.db"));

const customers = [
  { name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", segment: "VIP", total_orders: 8, total_spent: 12400 },
  { name: "Rahul Mehta", email: "rahul@email.com", phone: "+91 91234 56789", segment: "Active", total_orders: 3, total_spent: 3200 },
  { name: "Anjali Rao", email: "anjali@email.com", phone: "+91 99887 76655", segment: "New", total_orders: 1, total_spent: 850 },
  { name: "Karan Singh", email: "karan@email.com", phone: "+91 93456 78901", segment: "Lapsed", total_orders: 0, total_spent: 0 },
  { name: "Meera Nair", email: "meera@email.com", phone: "+91 87654 32109", segment: "Active", total_orders: 5, total_spent: 7100 },
  { name: "Arjun Patel", email: "arjun@email.com", phone: "+91 76543 21098", segment: "VIP", total_orders: 12, total_spent: 28900 },
  { name: "Sneha Iyer", email: "sneha@email.com", phone: "+91 88776 55443", segment: "New", total_orders: 1, total_spent: 1200 },
  { name: "Vikram Das", email: "vikram@email.com", phone: "+91 77665 44332", segment: "Lapsed", total_orders: 2, total_spent: 2400 },
  { name: "Pooja Verma", email: "pooja@email.com", phone: "+91 66554 33221", segment: "Active", total_orders: 4, total_spent: 5600 },
  { name: "Amit Kumar", email: "amit@email.com", phone: "+91 55443 22110", segment: "VIP", total_orders: 9, total_spent: 18700 },
];

const existing = db.prepare("SELECT COUNT(*) as count FROM customers").get();

if (existing.count === 0) {
  const insert = db.prepare(`
    INSERT INTO customers (id, name, email, phone, segment, total_orders, total_spent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  customers.forEach((c) => {
    insert.run(
      uuid(),
      c.name,
      c.email,
      c.phone,
      c.segment,
      c.total_orders,
      c.total_spent
    );
  });

  console.log("✅ Seeded customers");
}

const segs = db.prepare("SELECT COUNT(*) as count FROM segments").get();

if (segs.count === 0) {
  const ins = db.prepare(`
    INSERT INTO segments (id, name, description, channel)
    VALUES (?, ?, ?, ?)
  `);

  ins.run(uuid(), "VIP Shoppers", "Spent > ₹10,000 and 5+ orders", "WhatsApp");
  ins.run(uuid(), "Lapsed Customers", "No purchase in last 60 days", "Email");
  ins.run(uuid(), "New This Month", "First order within last 30 days", "SMS");
  ins.run(uuid(), "High Engagers", "Opened last 3 campaigns", "WhatsApp");
  ins.run(uuid(), "Cart Abandoners", "Added to cart but didn't purchase", "Email");

  console.log("✅ Seeded segments");
}

const ordersCount = db.prepare("SELECT COUNT(*) as count FROM orders").get();

if (ordersCount.count === 0) {
  const customersDb = db.prepare("SELECT * FROM customers").all();

  const insertOrder = db.prepare(`
    INSERT INTO orders (
      id,
      customer_id,
      customer_name,
      amount,
      status
    )
    VALUES (?, ?, ?, ?, ?)
  `);

  customersDb.forEach((customer) => {
    const orderCount = Math.max(1, customer.total_orders);

    for (let i = 0; i < orderCount; i++) {
      insertOrder.run(
        uuid(),
        customer.id,
        customer.name,
        Math.floor(Math.random() * 5000) + 500,
        Math.random() > 0.2 ? "Delivered" : "Pending"
      );
    }
  });

  console.log("✅ Seeded orders");
}