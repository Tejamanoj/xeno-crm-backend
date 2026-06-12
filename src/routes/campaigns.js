import express from "express";
import db from "../db/database.js";
import { v4 as uuid } from "uuid";
import { sendToChannelService } from "../services/channelService.js";

const router = express.Router();
router.get("/test", (req, res) => {
  res.json({ message: "campaign route works" });
});

router.get("/", (req, res) => {
  const campaigns = db.prepare("SELECT * FROM campaigns ORDER BY created_at DESC").all();
  const result = campaigns.map(c => {
    const comms = db.prepare("SELECT * FROM communications WHERE campaign_id = ?").all(c.id);
    return {
      ...c,
      sent:    comms.length,
      opened:  comms.filter(x => ["opened","clicked"].includes(x.status)).length,
      clicked: comms.filter(x => x.status === "clicked").length,
      failed:  comms.filter(x => x.status === "failed").length,
    };
  });
  res.json(result);
});

router.post("/", (req, res) => {
  const { name, segment_name, channel = "Email", message } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const id = uuid();
  db.prepare(`
    INSERT INTO campaigns (id, name, segment_name, channel, message, status)
    VALUES (?, ?, ?, ?, ?, 'sending')
  `).run(id, name, segment_name || "All", channel, message || "");

  const customers = segment_name
    ? db.prepare("SELECT * FROM customers WHERE segment = ?").all(segment_name)
    : db.prepare("SELECT * FROM customers").all();

customers.forEach(customer => {
  const commId = uuid();
  const personalised = (message || "").replace("{name}", customer.name);

  const random = Math.random();

  let status = "sent";

  if (random > 0.8) {
    status = "clicked";
  } else if (random > 0.4) {
    status = "opened";
  } else if (random < 0.05) {
    status = "failed";
  }

  db.prepare(`
    INSERT INTO communications (
      id,
      campaign_id,
      customer_id,
      customer_name,
      channel,
      message,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    commId,
    id,
    customer.id,
    customer.name,
    channel,
    personalised,
    status
  );

  sendToChannelService({
    commId,
    campaignId: id,
    customer,
    message: personalised,
    channel
  });
});

  const campaign = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(id);
  res.status(201).json(campaign);
});
router.get("/:id/communications", (req, res) => {
  const communications = db
    .prepare(`
      SELECT *
      FROM communications
      WHERE campaign_id = ?
      ORDER BY created_at DESC
    `)
    .all(req.params.id);

  res.json(communications);
});

export default router;