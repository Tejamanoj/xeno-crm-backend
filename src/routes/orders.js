import express from "express";
import db from "../db/database.js";

const router = express.Router();

router.get("/", (req, res) => {
  const orders = db
    .prepare(`
      SELECT *
      FROM orders
      ORDER BY created_at DESC
    `)
    .all();

  res.json(orders);
});

export default router;