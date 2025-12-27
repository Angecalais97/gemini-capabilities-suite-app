import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import {
  chat,
  vision,
  imageGen,
  search,
} from "./gemini/gemini.service.js";

const app = express();

// 1. SECURITY: Rate Limiting (Crucial for AI to prevent wallet-drain attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: "Too many requests, please try again later." }
});

// 2. MIDDLEWARE
app.use(cors());
app.use(limiter); // Apply rate limiting to all routes
app.use(express.json({ limit: "10mb" })); // Limit payload size to prevent DOS

// 3. K8S HEALTH CHECK (Liveness & Readiness)
app.get("/health", (req, res) => {
  // In a real 2027 scenario, you could also check if the Gemini API is reachable here
  res.status(200).json({ 
    status: "UP", 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 4. AI ROUTES
app.post("/api/chat", async (req, res) => {
  try {
    if (!req.body.message) return res.status(400).json({ error: "Message is required" });
    const text = await chat(req.body.message);
    res.json({ text });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({
      error: "Chat generation failed",
      details: err?.message || "Internal Server Error",
    });
  }
});

app.post("/api/vision", async (req, res) => {
  try {
    const { image, prompt, mimeType } = req.body;
    if (!image || !prompt) return res.status(400).json({ error: "Image and prompt are required" });
    const text = await vision(image, prompt, mimeType);
    res.json({ text });
  } catch (err) {
    console.error("VISION ERROR:", err);
    res.status(500).json({
      error: "Vision analysis failed",
      details: err?.message || "Internal Server Error",
    });
  }
});

app.post("/api/image", async (req, res) => {
  try {
    if (!req.body.prompt) return res.status(400).json({ error: "Prompt is required" });
    const image = await imageGen(req.body.prompt);
    res.json({ image });
  } catch (err) {
    console.error("IMAGE GEN ERROR:", err);
    res.status(500).json({
      error: "Image generation failed",
      details: err?.message || "Internal Server Error",
    });
  }
});

app.post("/api/search", async (req, res) => {
  try {
    if (!req.body.query) return res.status(400).json({ error: "Query is required" });
    const result = await search(req.body.query);
    res.json(result);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({
      error: "Search failed",
      details: err?.message || "Internal Server Error",
    });
  }
});

// 5. SERVER STARTUP
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// 6. GRACEFUL SHUTDOWN (The DevSecOps Secret Sauce)
// Catching SIGTERM (sent by K8s during updates)
process.on("SIGTERM", () => {
  console.info("SIGTERM signal received. Shutting down gracefully...");
  server.close(() => {
    console.log("Http server closed. Finalizing cleanup...");
    // Close any database connections here if you had them
    process.exit(0);
  });
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});