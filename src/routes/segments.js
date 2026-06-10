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

export default router;