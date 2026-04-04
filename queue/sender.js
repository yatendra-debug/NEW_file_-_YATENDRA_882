const nodemailer = require("nodemailer");

const HOURLY_LIMIT = 27;     // safe cap
const PARALLEL = 3;          // thoda fast (2 → 3)
const BASE_DELAY = 120;      // fast but not spammy

const store = {};

function canSend(email) {
  const now = Date.now();

  if (!store[email]) {
    store[email] = { count: 0, time: now };
  }

  if (now - store[email].time > 3600000) {
    store[email] = { count: 0, time: now };
  }

  if (store[email].count >= HOURLY_LIMIT) return false;

  store[email].count++;
  return true;
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

module.exports = async (data) => {
  const { email, password, sender, subject, message, recipients } = data;

  const list = recipients
    .split(/[\n,]+/)
    .map(e => e.trim())
    .filter(Boolean);

  let transporter;

  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: email, pass: password },
    });

    await transporter.verify();
  } catch (err) {
    throw new Error("Wrong app password");
  }

  let sentCount = 0;

  // 🔥 parallel batches
  for (let i = 0; i < list.length; i += PARALLEL) {

    const batch = list.slice(i, i + PARALLEL);

    const results = await Promise.allSettled(
      batch.map(async (to) => {

        if (!canSend(email)) return;

        try {
          await transporter.sendMail({
            from: `"${sender}" <${email}>`,
            to,
            subject,
            text: message, // 🔥 safer than html
          });

          return true;
        } catch {
          return false;
        }
      })
    );

    results.forEach(r => {
      if (r.status === "fulfilled" && r.value) sentCount++;
    });

    // 🔥 smart delay (random)
    await delay(BASE_DELAY + Math.random() * 300);
  }

  return sentCount;
};
