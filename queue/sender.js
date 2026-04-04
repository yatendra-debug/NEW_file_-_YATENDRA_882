const nodemailer = require("nodemailer");

const HOURLY_LIMIT = 27;
const PARALLEL = 2;
const BASE_DELAY = 200;
const MAX_RETRY = 1;

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

// 🔥 basic email validation
function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

module.exports = async (data) => {
  const { email, password, sender, subject, message, recipients } = data;

  const list = recipients
    .split(/[\n,]+/)
    .map(e => e.trim())
    .filter(e => isValidEmail(e)); // 🔥 invalid emails remove

  let transporter;

  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: email, pass: password },
    });

    await transporter.verify();
  } catch {
    throw new Error("Wrong app password");
  }

  let sentCount = 0;

  for (let i = 0; i < list.length; i += PARALLEL) {

    const batch = list.slice(i, i + PARALLEL);

    const results = await Promise.allSettled(
      batch.map(async (to) => {

        if (!canSend(email)) return;

        let attempts = 0;

        while (attempts <= MAX_RETRY) {
          try {
            await transporter.sendMail({
              from: `"${sender}" <${email}>`,
              to,
              subject,
              text: message,
              headers: {
                "X-Mailer": "NodeMailer",
                "X-Priority": "3"
              }
            });

            return true;

          } catch {
            attempts++;
            await delay(300);
          }
        }

        return false;
      })
    );

    results.forEach(r => {
      if (r.status === "fulfilled" && r.value) sentCount++;
    });

    await delay(BASE_DELAY + Math.random() * 400);
  }

  return sentCount;
};
