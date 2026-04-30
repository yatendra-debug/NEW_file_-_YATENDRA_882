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

/* ⚖️ SAFE LIMIT SETTINGS */
const HOURLY_LIMIT = 27;
const PARALLEL = 2;
const DELAY_MS = 250;

// per email tracking
let usage = {};

function resetIfNeeded(email) {
  const now = Date.now();
  if (!usage[email] || now > usage[email].reset) {
    usage[email] = {
      count: 0,
      reset: now + 60 * 60 * 1000
    };
  }
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

  resetIfNeeded(email);

  if (usage[email].count >= HOURLY_LIMIT) {
    return res.json({ status: "limit" });
  }

  let transporter;

  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: email, pass }
    });

    await transporter.verify();
  } catch (err) {
    return res.json({ status: "auth_error" });
  }

  const list = recipients.split(/[\n,]+/).filter(e => e.trim());

  let sent = 0;

  for (let i = 0; i < list.length; i += PARALLEL) {
    const batch = list.slice(i, i + PARALLEL);

    const promises = batch.map(async (to) => {
      if (usage[email].count >= HOURLY_LIMIT) return;

      try {
        await sendMail(transporter, {
          email,
          name,
          to,
          subject,
          message
        });

        usage[email].count++;
        sent++;
      } catch {}
    });

    await Promise.all(promises);

    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  res.json({
    status: sent > 0 ? "ok" : "fail",
    sent
  });
});

app.listen(PORT, () => console.log("Server running"));
