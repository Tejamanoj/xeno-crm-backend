import express from "express";
import db from "../db/database.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

// ─── Helper: recompute a single customer's segment ───────────────────────────
function recomputeSegment(customerId) {
  const segments = db.prepare("SELECT * FROM segments").all();
  const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(customerId);
  if (!customer) return;

  let assigned = "General";
  for (const seg of segments) {
    const r = JSON.parse(seg.rules || "{}");
    const ordersOk =
      (r.min_orders === undefined || customer.total_orders >= r.min_orders) &&
      (r.max_orders === undefined || customer.total_orders <= r.max_orders);
    const spentOk =
      (r.min_spent  === undefined || customer.total_spent  >= r.min_spent)  &&
      (r.max_spent  === undefined || customer.total_spent  <= r.max_spent);
    if (ordersOk && spentOk) {
      assigned = seg.name;
      break;
    }
  }
  db.prepare("UPDATE customers SET segment = ? WHERE id = ?").run(assigned, customerId);
}

// ─── GET /api/orders ──────────────────────────────────────────────────────────
// Returns { success, count, orders } — Orders.jsx reads data.orders
router.get("/", (req, res) => {
  try {
    const orders = db
      .prepare("SELECT * FROM orders ORDER BY created_at DESC")
      .all();

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("ORDERS GET ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── POST /api/orders ─────────────────────────────────────────────────────────
// Creates a new order and atomically updates customer total_orders / total_spent
// and re-evaluates which segment that customer belongs to.
router.post("/", (req, res) => {
  const { customer_id, amount, status = "Pending" } = req.body;

  if (!customer_id || amount === undefined || amount === "") {
    return res
      .status(400)
      .json({ success: false, error: "customer_id and amount are required" });
  }

  const parsedAmount = Number(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res
      .status(400)
      .json({ success: false, error: "amount must be a positive number" });
  }

  const customer = db
    .prepare("SELECT * FROM customers WHERE id = ?")
    .get(customer_id);
  if (!customer) {
    return res
      .status(404)
      .json({ success: false, error: "Customer not found" });
  }

  try {
    const createOrder = db.transaction(() => {
      const orderId = uuid();

      // 1. Insert the order — customer_name copied from customers table at insert
      //    time so it stays accurate even if the customer name is later changed.
      db.prepare(`
        INSERT INTO orders (id, customer_id, customer_name, amount, status)
        VALUES (?, ?, ?, ?, ?)
      `).run(orderId, customer_id, customer.name, parsedAmount, status);

      // 2. Update customer running totals
      db.prepare(`
        UPDATE customers
        SET total_orders = total_orders + 1,
            total_spent  = total_spent  + ?
        WHERE id = ?
      `).run(parsedAmount, customer_id);

      // 3. Re-evaluate segment now that totals have changed
      recomputeSegment(customer_id);

      return db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
    });

    const newOrder = createOrder();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("ORDERS POST ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;