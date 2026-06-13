// seed.js — uses the shared db connection (no second Database(...) call)
import db from "./database.js";
import { v4 as uuid } from "uuid";

// ─── Customers ────────────────────────────────────────────────────────────────
const customers = [
  // VIP Shoppers — 5+ orders, ₹10,000+ spent
  { name: "Arjun Patel",      email: "arjun@email.com",      phone: "+91 76543 21098", segment: "VIP Shoppers",    total_orders: 15, total_spent: 42000 },
  { name: "Amit Kumar",       email: "amit@email.com",       phone: "+91 55443 22110", segment: "VIP Shoppers",    total_orders: 12, total_spent: 31500 },
  { name: "Priya Sharma",     email: "priya@email.com",      phone: "+91 98765 43210", segment: "VIP Shoppers",    total_orders: 10, total_spent: 28900 },
  { name: "Rohan Kapoor",     email: "rohan@email.com",      phone: "+91 90123 45678", segment: "VIP Shoppers",    total_orders: 14, total_spent: 37200 },
  { name: "Divya Menon",      email: "divya@email.com",      phone: "+91 89012 34567", segment: "VIP Shoppers",    total_orders: 11, total_spent: 25600 },
  { name: "Suresh Reddy",     email: "suresh@email.com",     phone: "+91 78901 23456", segment: "VIP Shoppers",    total_orders: 13, total_spent: 33800 },
  { name: "Kavya Krishnan",   email: "kavya@email.com",      phone: "+91 67890 12345", segment: "VIP Shoppers",    total_orders: 9,  total_spent: 19400 },
  { name: "Nikhil Joshi",     email: "nikhil@email.com",     phone: "+91 56789 01234", segment: "VIP Shoppers",    total_orders: 16, total_spent: 45100 },
  { name: "Aishwarya Iyer",   email: "aishwarya@email.com",  phone: "+91 45678 90123", segment: "VIP Shoppers",    total_orders: 8,  total_spent: 17300 },
  { name: "Manoj Tiwari",     email: "manoj@email.com",      phone: "+91 34567 89012", segment: "VIP Shoppers",    total_orders: 18, total_spent: 52000 },

  // Active Buyers — 2-9 orders, under ₹10,000 spent
  { name: "Rahul Mehta",      email: "rahul@email.com",      phone: "+91 91234 56789", segment: "Active Buyers",   total_orders: 4,  total_spent: 5200  },
  { name: "Meera Nair",       email: "meera@email.com",      phone: "+91 87654 32109", segment: "Active Buyers",   total_orders: 5,  total_spent: 7100  },
  { name: "Pooja Verma",      email: "pooja@email.com",      phone: "+91 66554 33221", segment: "Active Buyers",   total_orders: 4,  total_spent: 5600  },
  { name: "Vikram Das",       email: "vikram@email.com",     phone: "+91 77665 44332", segment: "Active Buyers",   total_orders: 3,  total_spent: 3800  },
  { name: "Siddharth Roy",    email: "siddharth@email.com",  phone: "+91 93456 12340", segment: "Active Buyers",   total_orders: 6,  total_spent: 8900  },
  { name: "Lakshmi Pillai",   email: "lakshmi@email.com",    phone: "+91 82345 01239", segment: "Active Buyers",   total_orders: 3,  total_spent: 4200  },
  { name: "Gaurav Sharma",    email: "gaurav@email.com",     phone: "+91 71234 90128", segment: "Active Buyers",   total_orders: 7,  total_spent: 9600  },
  { name: "Tanvi Desai",      email: "tanvi@email.com",      phone: "+91 60123 89017", segment: "Active Buyers",   total_orders: 2,  total_spent: 2900  },
  { name: "Rajesh Pandey",    email: "rajesh@email.com",     phone: "+91 59012 78906", segment: "Active Buyers",   total_orders: 5,  total_spent: 6700  },
  { name: "Nisha Agarwal",    email: "nisha@email.com",      phone: "+91 48901 67895", segment: "Active Buyers",   total_orders: 4,  total_spent: 5100  },
  { name: "Vivek Malhotra",   email: "vivek@email.com",      phone: "+91 37890 56784", segment: "Active Buyers",   total_orders: 6,  total_spent: 8300  },
  { name: "Shruti Bose",      email: "shruti@email.com",     phone: "+91 26789 45673", segment: "Active Buyers",   total_orders: 3,  total_spent: 3500  },
  { name: "Deepak Nair",      email: "deepak@email.com",     phone: "+91 95678 34562", segment: "Active Buyers",   total_orders: 2,  total_spent: 2200  },
  { name: "Preeti Saxena",    email: "preeti@email.com",     phone: "+91 84567 23451", segment: "Active Buyers",   total_orders: 7,  total_spent: 9200  },
  { name: "Harish Chandra",   email: "harish@email.com",     phone: "+91 73456 12340", segment: "Active Buyers",   total_orders: 4,  total_spent: 4800  },

  // New This Month — exactly 1 order
  { name: "Anjali Rao",       email: "anjali@email.com",     phone: "+91 99887 76655", segment: "New This Month",  total_orders: 1,  total_spent: 850   },
  { name: "Sneha Iyer",       email: "sneha@email.com",      phone: "+91 88776 55443", segment: "New This Month",  total_orders: 1,  total_spent: 1200  },
  { name: "Akash Gupta",      email: "akash@email.com",      phone: "+91 77665 44331", segment: "New This Month",  total_orders: 1,  total_spent: 990   },
  { name: "Riya Singh",       email: "riya@email.com",       phone: "+91 66554 33220", segment: "New This Month",  total_orders: 1,  total_spent: 1500  },
  { name: "Yash Trivedi",     email: "yash@email.com",       phone: "+91 55443 22109", segment: "New This Month",  total_orders: 1,  total_spent: 750   },
  { name: "Ishaan Khanna",    email: "ishaan@email.com",     phone: "+91 44332 11098", segment: "New This Month",  total_orders: 1,  total_spent: 1800  },
  { name: "Muskaan Shah",     email: "muskaan@email.com",    phone: "+91 33221 00987", segment: "New This Month",  total_orders: 1,  total_spent: 620   },
  { name: "Parth Jain",       email: "parth@email.com",      phone: "+91 22110 99876", segment: "New This Month",  total_orders: 1,  total_spent: 1100  },
  { name: "Zara Khan",        email: "zara@email.com",       phone: "+91 11009 88765", segment: "New This Month",  total_orders: 1,  total_spent: 930   },
  { name: "Dev Chauhan",      email: "dev@email.com",        phone: "+91 90998 77654", segment: "New This Month",  total_orders: 1,  total_spent: 1350  },

  // Lapsed Customers — 0 orders
  { name: "Karan Singh",      email: "karan@email.com",      phone: "+91 93456 78901", segment: "Lapsed Customers", total_orders: 0, total_spent: 0 },
  { name: "Ananya Bhatia",    email: "ananya@email.com",     phone: "+91 80987 65432", segment: "Lapsed Customers", total_orders: 0, total_spent: 0 },
  { name: "Rohit Sinha",      email: "rohit@email.com",      phone: "+91 79876 54321", segment: "Lapsed Customers", total_orders: 0, total_spent: 0 },
  { name: "Pallavi Rao",      email: "pallavi@email.com",    phone: "+91 68765 43210", segment: "Lapsed Customers", total_orders: 0, total_spent: 0 },
  { name: "Nitin Dubey",      email: "nitin@email.com",      phone: "+91 57654 32109", segment: "Lapsed Customers", total_orders: 0, total_spent: 0 },
  { name: "Swati Mishra",     email: "swati@email.com",      phone: "+91 46543 21098", segment: "Lapsed Customers", total_orders: 0, total_spent: 0 },
  { name: "Arun Pillai",      email: "arun@email.com",       phone: "+91 35432 10987", segment: "Lapsed Customers", total_orders: 0, total_spent: 0 },
  { name: "Bhavna Tiwari",    email: "bhavna@email.com",     phone: "+91 24321 09876", segment: "Lapsed Customers", total_orders: 0, total_spent: 0 },
  { name: "Chetan Verma",     email: "chetan@email.com",     phone: "+91 13210 98765", segment: "Lapsed Customers", total_orders: 0, total_spent: 0 },
  { name: "Disha Kulkarni",   email: "disha@email.com",      phone: "+91 92109 87654", segment: "Lapsed Customers", total_orders: 0, total_spent: 0 },
  { name: "Farhan Sheikh",    email: "farhan@email.com",     phone: "+91 81098 76543", segment: "Lapsed Customers", total_orders: 0, total_spent: 0 },
];

// ─── Step 1: Seed customers ───────────────────────────────────────────────────
const existingCustomers = db.prepare("SELECT COUNT(*) as count FROM customers").get();
if (existingCustomers.count === 0) {
  const insert = db.prepare(`
    INSERT INTO customers (id, name, email, phone, segment, total_orders, total_spent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  customers.forEach((c) => {
    insert.run(uuid(), c.name, c.email, c.phone, c.segment, c.total_orders, c.total_spent);
  });
  console.log("✅ Seeded customers");
}

// ─── Step 2: Seed segments ────────────────────────────────────────────────────
const existingSegments = db.prepare("SELECT COUNT(*) as count FROM segments").get();
if (existingSegments.count === 0) {
  const ins = db.prepare(`
    INSERT INTO segments (id, name, description, channel, rules)
    VALUES (?, ?, ?, ?, ?)
  `);
  ins.run(uuid(), "VIP Shoppers",     "Spent > ₹10,000 and 5+ orders",   "WhatsApp", JSON.stringify({ min_spent: 10000, min_orders: 5 }));
  ins.run(uuid(), "Active Buyers",    "2-9 orders, under ₹10,000 spent", "Email",    JSON.stringify({ min_orders: 2, max_orders: 9, max_spent: 9999 }));
  ins.run(uuid(), "New This Month",   "Exactly 1 order placed",           "SMS",      JSON.stringify({ min_orders: 1, max_orders: 1 }));
  ins.run(uuid(), "Lapsed Customers", "No orders yet",                    "Email",    JSON.stringify({ max_orders: 0 }));
  console.log("✅ Seeded segments");
}

// ─── Step 3: Seed orders — MUST run before segment recompute ─────────────────
const existingOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get();
if (existingOrders.count === 0) {
  const freshCustomers = db.prepare("SELECT * FROM customers").all();

  const insertOrder = db.prepare(`
    INSERT INTO orders (id, customer_id, customer_name, amount, status)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Track real amounts so we can write back accurate totals
  const customerTotals = {};

  freshCustomers.forEach((customer) => {
    // Lapsed customers get 0 orders — everyone else gets at least 1
    const orderCount = customer.total_orders;
    customerTotals[customer.id] = { count: 0, spent: 0 };

    for (let i = 0; i < orderCount; i++) {
      const amount = Math.floor(Math.random() * 5000) + 500;
      const status = Math.random() > 0.2 ? "Delivered" : "Pending";
      insertOrder.run(uuid(), customer.id, customer.name, amount, status);
      customerTotals[customer.id].count += 1;
      customerTotals[customer.id].spent += amount;
    }
  });

  // Write real order totals back to customers table
  const updateTotals = db.prepare(
    "UPDATE customers SET total_orders = ?, total_spent = ? WHERE id = ?"
  );
  for (const [customerId, totals] of Object.entries(customerTotals)) {
    updateTotals.run(totals.count, totals.spent, customerId);
  }

  console.log("✅ Seeded orders");
  console.log("✅ Synced customer total_orders + total_spent from seeded orders");
}

// ─── Step 4: Recompute segments — runs AFTER orders so totals are accurate ───
const allSegments  = db.prepare("SELECT * FROM segments").all();
const allCustomers = db.prepare("SELECT * FROM customers").all();
const updateSeg    = db.prepare("UPDATE customers SET segment = ? WHERE id = ?");

allCustomers.forEach((c) => {
  let assigned = "General";
  for (const seg of allSegments) {
    const r = JSON.parse(seg.rules || "{}");
    const ordersOk =
      (r.min_orders === undefined || c.total_orders >= r.min_orders) &&
      (r.max_orders === undefined || c.total_orders <= r.max_orders);
    const spentOk =
      (r.min_spent  === undefined || c.total_spent  >= r.min_spent)  &&
      (r.max_spent  === undefined || c.total_spent  <= r.max_spent);
    if (ordersOk && spentOk) {
      assigned = seg.name;
      break;
    }
  }
  updateSeg.run(assigned, c.id);
});
console.log("✅ Recomputed customer segments from rules (after orders seeded)");