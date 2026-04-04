import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// serve frontend
app.use(express.static(path.resolve("./")));

// ⏱ rate limit
let lastSent = 0;

// 📤 send route
app.post("/send", async (req, res) => {
  const { email, pass, sender, subject, message, recipients } = req.body;

  if (!email || !pass || !recipients) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const now = Date.now();
  if (now - lastSent < 5000) {
    return res.status(429).json({ error: "Wait 5 sec..." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: email, pass: pass },
    });

    const list = recipients.split(/,|\n/);

    for (let to of list) {
      await new Promise(r => setTimeout(r, 5000)); // delay

      await transporter.sendMail({
        from: `"${sender}" <${email}>`,
        to: to.trim(),
        subject: subject || "Hello",
        text: `Hello,\n\n${message}\n\nRegards`,
      });
    }

    lastSent = now;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// home
app.get("/", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Running...");
});
