import db from "../db/database.js";

const STATUSES = ["delivered", "opened", "clicked", "failed"];
const WEIGHTS  = [0.2, 0.45, 0.25, 0.1];

function pickStatus() {
  const r = Math.random();
  let sum = 0;
  for (let i = 0; i < WEIGHTS.length; i++) {
    sum += WEIGHTS[i];
    if (r < sum) return STATUSES[i];
  }
  return "delivered";
}

export function sendToChannelService({ commId, campaignId }) {
  const delay = Math.floor(Math.random() * 4000) + 1000;
  setTimeout(() => {
    const status = pickStatus();
    db.prepare("UPDATE communications SET status = ? WHERE id = ?").run(status, commId);
    const pending = db.prepare(`
      SELECT COUNT(*) as c FROM communications
      WHERE campaign_id = ? AND status = 'sent'
    `).get(campaignId).c;
    if (pending === 0) {
      db.prepare("UPDATE campaigns SET status = 'completed' WHERE id = ?").run(campaignId);
    }
  }, delay);
}