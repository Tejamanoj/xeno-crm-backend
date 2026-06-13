import express from "express";
import db from "../db/database.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

// ─── GET /api/customers ───────────────────────────────────────────────────────
router.get("/", (req, res) => {
  try {
    const customers = db
      .prepare("SELECT * FROM customers ORDER BY created_at DESC")
      .all();
    res.json(customers);
  } catch (error) {
    console.error("CUSTOMERS GET ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/customers ──────────────────────────────────────────────────────
router.post("/", (req, res) => {
  const { name, email, phone, segment = "New" } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: "Name and email are required" });

  try {
    const id = uuid();
    db.prepare(`
      INSERT INTO customers (id, name, email, phone, segment, total_orders, total_spent)
      VALUES (?, ?, ?, ?, ?, 0, 0)
    `).run(id, name, email, phone || "", segment);

    const customer = db
      .prepare("SELECT * FROM customers WHERE id = ?")
      .get(id);
    res.status(201).json(customer);
  } catch {
    res.status(400).json({ error: "Email already exists" });
  }
});

// ─── PATCH /api/customers/:id ─────────────────────────────────────────────────
// Admin corrections to total_orders / total_spent / segment.
router.patch("/:id", (req, res) => {
  const { total_orders, total_spent, segment } = req.body;
  const customer = db
    .prepare("SELECT * FROM customers WHERE id = ?")
    .get(req.params.id);
  if (!customer)
    return res.status(404).json({ error: "Customer not found" });

  try {
    const newOrders = total_orders !== undefined ? Number(total_orders) : customer.total_orders;
    const newSpent  = total_spent  !== undefined ? Number(total_spent)  : customer.total_spent;
    const newSeg    = segment      !== undefined ? segment              : customer.segment;

    db.prepare(`
      UPDATE customers
      SET total_orders = ?, total_spent = ?, segment = ?
      WHERE id = ?
    `).run(newOrders, newSpent, newSeg, req.params.id);

    const updated = db
      .prepare("SELECT * FROM customers WHERE id = ?")
      .get(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── DELETE /api/customers/:id ────────────────────────────────────────────────
router.delete("/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM customers WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;