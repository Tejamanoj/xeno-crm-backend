import express from "express";
import db from "../db/database.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const orders = db.prepare("SELECT * FROM orders").all();

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;