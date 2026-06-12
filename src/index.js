import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db/seed.js";

import customersRouter from "./routes/customers.js";
import segmentsRouter from "./routes/segments.js";
import campaignsRouter from "./routes/campaigns.js";
import analyticsRouter from "./routes/analytics.js";
import aiRouter from "./routes/ai.js";
import ordersRouter from "./routes/orders.js";

dotenv.config();

console.log("API KEY FOUND:", !!process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/customers", customersRouter);
app.use("/api/segments", segmentsRouter);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/ai", aiRouter);
app.use("/api/orders", ordersRouter);

app.get("/", (_, res) =>
  res.json({ status: "Xeno CRM API running ✅" })
);

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);