// ===================================================
//  Velocità — Express Server (Entry Point)
//  เทียบเท่า main.py ของ FastAPI
// ===================================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────
app.use(cors());                  // CORS — อนุญาตให้ Frontend เรียก API ได้
app.use(express.json());          // Parse JSON body (เหมือน Pydantic auto-parse)
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────
app.use("/api", adminRoutes);
app.use("/api", vehicleRoutes);

// ── Root & Health ───────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Velocita API is running" });
});

app.get("/health", async (req, res) => {
  const { pool } = require("./config/db");
  try {
    const conn = await pool.getConnection();
    conn.release();
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.json({ status: "error", database: err.message });
  }
});

// ── Start Server ────────────────────────────────────
app.listen(PORT, async () => {
  console.log("Velocita API running at http://localhost:" + PORT);
  console.log("Health check: http://localhost:" + PORT + "/health");
  await testConnection();
});
