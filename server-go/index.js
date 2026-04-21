const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(express.json());
app.use(cors());

// 🔑 API KEY dari environment Docker
const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY
});

// 🧪 test route
app.get("/", (req, res) => {
  res.send("Server jalan 🚀");
});

// 🤖 chatbot endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        reply: "Pesan kosong!"
      });
    }

    let response;

    // 🔁 retry kalau Gemini sibuk (503)
    for (let i = 0; i < 3; i++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-1.5-flash", // lebih stabil dari 2.5
          contents: `Jawab pakai bahasa Indonesia santai:\nUser: ${userMessage}`,
        });

        break; // kalau sukses langsung keluar loop
      } catch (err) {
        console.log("Retry Gemini ke-", i + 1);

        if (i === 2) throw err;

        // tunggu 2 detik sebelum retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // 🟢 ambil hasil dengan benar
    const reply = response?.text?.() || "AI tidak memberi jawaban";

    res.json({ reply });

  } catch (err) {
    console.error("ERROR GEMINI:", err);

    res.status(500).json({
      reply: "AI lagi sibuk 😅 coba lagi sebentar ya"
    });
  }
});

// 🌐 jalankan server (WAJIB 0.0.0.0 biar client bisa akses)
app.listen(3000, "0.0.0.0", () => {
  console.log("Server jalan di http://0.0.0.0:3000");
});