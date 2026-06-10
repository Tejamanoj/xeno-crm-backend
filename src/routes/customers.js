import express from "express";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "../../crm.db"));

const router = express.Router();

router.get("/", (req, res) => {
  const customers = db.prepare("SELECT * FROM customers ORDER BY created_at DESC").all();
  res.json(customers);
});

router.post("/", (req, res) => {
  const { name, email, phone, segment = "New" } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email required" });
  try {
    const id = uuid();
    db.prepare(`INSERT INTO customers (id, name, email, phone, segment) VALUES (?, ?, ?, ?, ?)`)
      .run(id, name, email, phone || "", segment);
    const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
    res.status(201).json(customer);
  } catch (e) {
    res.status(400).json({ error: "Email already exists" });
  }
});

router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM customers WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

export default router;