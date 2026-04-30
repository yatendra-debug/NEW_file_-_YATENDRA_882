import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// queue system
let queue = [];
let sending = false;

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// send mail
async function sendMail(config, data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email,
      pass: config.pass
    }
  });

  await transporter.sendMail({
    from: `"${data.name}" <${config.email}>`,
    to: data.to,
    subject: data.subject,
    text: data.text
  });
}

// queue processor
async function processQueue(config) {
  if (sending) return;
  sending = true;

  while (queue.length > 0) {
    const mail = queue.shift();

    try {
      await sendMail(config, mail);
      console.log("✅ Sent:", mail.to);
    } catch (err) {
      console.log("❌ Error:", mail.to, err.message);
    }

    // safe delay (7–15 sec)
    const wait = Math.floor(Math.random() * 8000) + 7000;
    await delay(wait);
  }

  sending = false;
}

// API
app.post("/send", (req, res) => {
  const { email, pass, name, subject, message, recipients } = req.body;

  const list = recipients
    .split(/[\n,]+/)
    .map(e => e.trim())
    .filter(e => e);

  list.forEach(r => {
    queue.push({
      to: r,
      subject,
      text: message,
      name
    });
  });

  processQueue({ email, pass });

  res.json({ status: "queued", total: list.length });
});

// health route
app.get("/", (req, res) => {
  res.send("🚀 Gmail Launcher Running");
});

// IMPORTANT for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
