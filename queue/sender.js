const nodemailer = require("nodemailer");

const HOURLY_LIMIT = 27;
const PARALLEL = 1;        // safest
const BASE_DELAY = 300;    // human-like delay

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
  return new Promise(r => setTimeout(r, ms));
}

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

module.exports = async (data) => {
  const { email, password, sender, subject, message, recipients } = data;

  const list = recipients
    .split(/[\n,]+/)
    .map(e => e.trim())
    .filter(e => isValidEmail(e));

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

        if (!canSend(email)) return false;

        try {
          await transporter.sendMail({
            from: `"${sender}" <${email}>`,
            to,
            subject,

            // 🔥 CLEAN TEXT ONLY (BEST FOR INBOX)
            text: message,

            headers: {
              "Reply-To": email,
              "List-Unsubscribe": `<mailto:${email}?subject=unsubscribe>`,
              "X-Mailer": "NodeMailer"
            }
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

    await delay(BASE_DELAY + Math.random() * 800);
  }

  return sentCount;
};
