import express from "express";
import db from "../db/database.js";

const router = express.Router();

// Main Analytics
router.get("/", (req, res) => {
  const total_customers = db
    .prepare("SELECT COUNT(*) as c FROM customers")
    .get().c;

  const total_segments = db
    .prepare("SELECT COUNT(*) as c FROM segments")
    .get().c;

  const total_campaigns = db
    .prepare("SELECT COUNT(*) as c FROM campaigns")
    .get().c;

  const total_sent = db
    .prepare("SELECT COUNT(*) as c FROM communications")
    .get().c;

  const total_opened = db
    .prepare(`
      SELECT COUNT(*) as c
      FROM communications
      WHERE status IN ('opened','clicked')
    `)
    .get().c;

  const total_clicked = db
    .prepare(`
      SELECT COUNT(*) as c
      FROM communications
      WHERE status = 'clicked'
    `)
    .get().c;

  const total_failed = db
    .prepare(`
      SELECT COUNT(*) as c
      FROM communications
      WHERE status = 'failed'
    `)
    .get().c;

  const open_rate =
    total_sent > 0
      ? ((total_opened / total_sent) * 100).toFixed(1)
      : 0;

  const click_rate =
    total_sent > 0
      ? ((total_clicked / total_sent) * 100).toFixed(1)
      : 0;

  const byChannel = db.prepare(`
    SELECT
      channel,
      COUNT(*) as sent,
      SUM(
        CASE
          WHEN status IN ('opened','clicked')
          THEN 1
          ELSE 0
        END
      ) as opened
    FROM communications
    GROUP BY channel
  `).all();

  res.json({
    total_customers,
    total_segments,
    total_campaigns,
    total_sent,
    total_opened,
    total_clicked,
    total_failed,
    open_rate,
    click_rate,
    byChannel,
  });
});

// Dashboard Trend Graph
router.get("/trend", (req, res) => {
  const trend = db.prepare(`
    SELECT
      date(created_at) as day,
      COUNT(*) as sent,
      SUM(
        CASE
          WHEN status IN ('opened','clicked')
          THEN 1
          ELSE 0
        END
      ) as opened
    FROM communications
    GROUP BY date(created_at)
    ORDER BY date(created_at)
  `).all();

  res.json(trend);
});

export default router;