import express from "express";
import db from "../db/database.js";
import { v4 as uuid } from "uuid";
import { sendToChannelService } from "../services/channelService.js";

const router = express.Router();

// ─── Helper: build live stats from communications rows ────────────────────────
function liveStats(campaignId) {
  const comms = db
    .prepare("SELECT * FROM communications WHERE campaign_id = ?")
    .all(campaignId);
  return {
    sent:    comms.length,
    opened:  comms.filter((x) => ["opened", "clicked"].includes(x.status)).length,
    clicked: comms.filter((x) => x.status === "clicked").length,
    failed:  comms.filter((x) => x.status === "failed").length,
  };
}

// ─── GET /api/campaigns/test ──────────────────────────────────────────────────
router.get("/test", (_req, res) => {
  res.json({ message: "campaign route works" });
});

// ─── GET /api/campaigns ───────────────────────────────────────────────────────
// Returns every campaign with live sent/opened/clicked/failed counts derived
// from the communications table — so the Campaigns page always reflects reality.
router.get("/", (_req, res) => {
  try {
    const campaigns = db
      .prepare("SELECT * FROM campaigns ORDER BY created_at DESC")
      .all();

    const result = campaigns.map((c) => ({ ...c, ...liveStats(c.id) }));
    res.json(result);
  } catch (error) {
    console.error("CAMPAIGNS GET ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─── POST /api/campaigns ──────────────────────────────────────────────────────
// 1. Creates the campaign row (status = 'sending').
// 2. Fetches every customer in the target segment (or all customers if none).
// 3. Inserts one communications row per customer with a simulated open/click status.
// 4. Marks campaign as 'completed' and returns it with live counts.
router.post("/", (req, res) => {
  const { name, segment_name, channel = "Email", message } = req.body;
  if (!name) return res.status(400).json({ error: "Campaign name is required" });

  try {
    const id = uuid();

    // Step 1: create campaign
    db.prepare(`
      INSERT INTO campaigns (id, name, segment_name, channel, message, status)
      VALUES (?, ?, ?, ?, ?, 'sending')
    `).run(id, name, segment_name || "All", channel, message || "");

    // Step 2: resolve target customers
    const customers = segment_name
      ? db.prepare("SELECT * FROM customers WHERE segment = ?").all(segment_name)
      : db.prepare("SELECT * FROM customers").all();

    // Step 3: insert one communication per customer
    const insertComm = db.prepare(`
      INSERT INTO communications (id, campaign_id, customer_id, customer_name, channel, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    customers.forEach((customer) => {
      const commId      = uuid();
      const personalised = (message || "").replace("{name}", customer.name);

      // Simulate realistic engagement: 20 % click, 40 % open-only, 5 % fail, rest sent
      const rand = Math.random();
      const status =
        rand > 0.8  ? "clicked" :
        rand > 0.4  ? "opened"  :
        rand < 0.05 ? "failed"  : "sent";

      insertComm.run(commId, id, customer.id, customer.name, channel, personalised, status);

      // Fire-and-forget to the channel service; errors are non-fatal
      try {
        sendToChannelService({
          commId,
          campaignId: id,
          customer,
          message: personalised,
          channel,
        });
      } catch (svcErr) {
        console.warn("channelService error (non-fatal):", svcErr.message);
      }
    });

    // Step 4: mark completed and return with live counts
    db.prepare("UPDATE campaigns SET status = 'completed' WHERE id = ?").run(id);

    const campaign = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(id);
    res.status(201).json({ ...campaign, ...liveStats(id) });
  } catch (error) {
    console.error("CAMPAIGNS POST ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// ─── GET /api/campaigns/:id/communications ────────────────────────────────────
router.get("/:id/communications", (req, res) => {
  try {
    const communications = db
      .prepare("SELECT * FROM communications WHERE campaign_id = ? ORDER BY created_at DESC")
      .all(req.params.id);
    res.json(communications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;