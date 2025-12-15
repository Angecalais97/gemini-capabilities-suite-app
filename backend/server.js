import express from "express";
import cors from "cors";
import {
  chat,
  vision,
  imageGen,
  search,
} from "./gemini/gemini.service.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/api/chat", async (req, res) => {
  try {
    const text = await chat(req.body.message);
    res.json({ text });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({
      error: "Chat generation failed",
      details: err?.message || err,
    });
  }
});

app.post("/api/vision", async (req, res) => {
  try {
    const { image, prompt, mimeType } = req.body;
    const text = await vision(image, prompt, mimeType);
    res.json({ text });
  } catch (err) {
    console.error("VISION ERROR:", err);
    res.status(500).json({
      error: "Vision analysis failed",
      details: err?.message || err,
    });
  }
});

app.post("/api/image", async (req, res) => {
  try {
    const image = await imageGen(req.body.prompt);
    res.json({ image });
  } catch (err) {
    console.error("IMAGE GEN ERROR:", err);
    res.status(500).json({
      error: "Image generation failed",
      details: err?.message || err,
    });
  }
});

app.post("/api/search", async (req, res) => {
  try {
    const result = await search(req.body.query);
    res.json(result);
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({
      error: "Search failed",
      details: err?.message || err,
    });
  }
});

app.listen(3000, () => {
  console.log("Backend running on 3000");
});
