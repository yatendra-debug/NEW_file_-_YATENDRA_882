import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

/* ⚖️ SETTINGS */
const HOURLY_LIMIT = 27;
const PARALLEL = 2;
const DELAY_MS = 300;

let usage = {};

function reset(email) {
  const now = Date.now();
  if (!usage[email] || now > usage[email].reset) {
    usage[email] = {
      count: 0,
      reset: now + 60 * 60 * 1000
    };
  }
}

// transporter
function createTransporter(email, pass) {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: pass
    }
  });
}

// send function
async function sendMail(transporter, data) {
  return transporter.sendMail({
    from: `"${data.name}" <${data.email}>`,
    to: data.to,
    subject: data.subject,
    text: data.message
  });
}

// API
app.post("/send", async (req, res) => {
  const { email, pass, name, subject, message, recipients } = req.body;

  reset(email);

  if (usage[email].count >= HOURLY_LIMIT) {
    return res.json({ status: "limit" });
  }

  let transporter;

  try {
    transporter = createTransporter(email, pass);

    // 🔥 IMPORTANT VERIFY
    await transporter.verify();
  } catch (err) {
    console.log("Auth Error:", err.message);
    return res.json({ status: "auth_error" });
  }

  const list = recipients
    .split(/[\n,]+/)
    .map(e => e.trim())
    .filter(e => e);

  let sent = 0;

  for (let i = 0; i < list.length; i += PARALLEL) {
    if (usage[email].count >= HOURLY_LIMIT) break;

    const batch = list.slice(i, i + PARALLEL);

    const results = await Promise.allSettled(
      batch.map(to =>
        sendMail(transporter, {
          email,
          name,
          subject,
          message,
          to
        })
      )
    );

    results.forEach(r => {
      if (r.status === "fulfilled") {
        usage[email].count++;
        sent++;
      } else {
        console.log("Send fail:", r.reason?.message);
      }
    });

    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  res.json({
    status: sent > 0 ? "ok" : "fail",
    sent
  });
});

app.listen(PORT, () => {
  console.log("🚀 Server running on", PORT);
});
