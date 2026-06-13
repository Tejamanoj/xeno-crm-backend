import express from "express";
import db from "../db/database.js";
import { v4 as uuid } from "uuid";

const router = express.Router();

router.get("/", (req, res) => {
  const segments = db.prepare("SELECT * FROM segments ORDER BY created_at DESC").all();
  const result = segments.map(s => ({
    ...s,
    count: db.prepare("SELECT COUNT(*) as c FROM customers WHERE segment = ?").get(s.name)?.c || 0
  }));
  res.json(result);
});

router.post("/", (req, res) => {
  const { name, description, channel = "Email" } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const id = uuid();
  db.prepare(`INSERT INTO segments (id, name, description, channel) VALUES (?, ?, ?, ?)`)
    .run(id, name, description || "", channel);
  const segment = db.prepare("SELECT * FROM segments WHERE id = ?").get(id);
  res.status(201).json(segment);
});

router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM segments WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});
// Get customers matching a segment's rules
router.get("/:id/customers", (req, res) => {
  const segment = db
    .prepare("SELECT * FROM segments WHERE id = ?")
    .get(req.params.id);

  if (!segment) {
    return res.status(404).json({
      error: "Segment not found",
    });
  }

  const rules = JSON.parse(segment.rules || "{}");

  let query = "SELECT * FROM customers WHERE 1=1";
  const params = [];

  if (rules.min_orders !== undefined) {
    query += " AND total_orders >= ?";
    params.push(rules.min_orders);
  }

  if (rules.max_orders !== undefined) {
    query += " AND total_orders <= ?";
    params.push(rules.max_orders);
  }

  if (rules.min_spent !== undefined) {
    query += " AND total_spent >= ?";
    params.push(rules.min_spent);
  }

  if (rules.max_spent !== undefined) {
    query += " AND total_spent <= ?";
    params.push(rules.max_spent);
  }

  const customers = db.prepare(query).all(...params);

  res.json({
    segment: segment.name,
    rules,
    count: customers.length,
    customers,
  });
});

export default router;