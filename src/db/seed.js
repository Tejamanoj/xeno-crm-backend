import "./database.js";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "../../crm.db"));

const customers = [
  { name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", segment: "VIP", total_orders: 8, total_spent: 12400 },
  { name: "Rahul Mehta", email: "rahul@email.com", phone: "+91 91234 56789", segment: "Active Buyers", total_orders: 3, total_spent: 3200 },
  { name: "Anjali Rao", email: "anjali@email.com", phone: "+91 99887 76655", segment: "New This Month", total_orders: 1, total_spent: 850 },
  { name: "Karan Singh", email: "karan@email.com", phone: "+91 93456 78901", segment: "Lapsed", total_orders: 0, total_spent: 0 },
  { name: "Meera Nair", email: "meera@email.com", phone: "+91 87654 32109", segment: "Active", total_orders: 5, total_spent: 7100 },
  { name: "Arjun Patel", email: "arjun@email.com", phone: "+91 76543 21098", segment: "VIP Shoppers", total_orders: 12, total_spent: 28900 },
  { name: "Sneha Iyer", email: "sneha@email.com", phone: "+91 88776 55443", segment: "New", total_orders: 1, total_spent: 1200 },
  { name: "Vikram Das", email: "vikram@email.com", phone: "+91 77665 44332", segment: "Lapsed Customers", total_orders: 2, total_spent: 2400 },
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
    INSERT INTO segments (id, name, description, channel, rules)
    VALUES (?, ?, ?, ?, ?)
  `);

  ins.run(
    uuid(),
    "VIP Shoppers",
    "Spent > ₹10,000 and 5+ orders",
    "WhatsApp",
    JSON.stringify({ min_spent: 10000, min_orders: 5 })
  );

  ins.run(
    uuid(),
    "Active Buyers",
    "2-9 orders, under ₹10,000 spent",
    "Email",
    JSON.stringify({ min_orders: 2, max_orders: 9, max_spent: 9999 })
  );

  ins.run(
    uuid(),
    "New This Month",
    "Exactly 1 order placed",
    "SMS",
    JSON.stringify({ min_orders: 1, max_orders: 1 })
  );

  ins.run(
    uuid(),
    "Lapsed Customers",
    "No orders yet",
    "Email",
    JSON.stringify({ max_orders: 0 })
  );

  console.log("✅ Seeded segments");
}

// Recompute each customer's segment label based on the rules above
const allSegments = db.prepare("SELECT * FROM segments").all();
const allCustomers = db.prepare("SELECT * FROM customers").all();

const updateSeg = db.prepare("UPDATE customers SET segment = ? WHERE id = ?");

allCustomers.forEach((c) => {
  let assigned = "General";

  for (const seg of allSegments) {
    const r = JSON.parse(seg.rules || "{}");
    const ordersOk =
      (r.min_orders === undefined || c.total_orders >= r.min_orders) &&
      (r.max_orders === undefined || c.total_orders <= r.max_orders);
    const spentOk =
      (r.min_spent === undefined || c.total_spent >= r.min_spent) &&
      (r.max_spent === undefined || c.total_spent <= r.max_spent);

    if (ordersOk && spentOk) {
      assigned = seg.name;
      break;
    }
  }

  updateSeg.run(assigned, c.id);
});

console.log("✅ Recomputed customer segments from rules");

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