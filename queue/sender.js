const nodemailer = require("nodemailer");

const HOURLY_LIMIT = 27;
const BATCH_SIZE = 2;        // 🔥 safer (3 se kam spam)
const BATCH_DELAY = 400;     // 🔥 slow = inbox better

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

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// 🔥 clean subject (spam words remove)
function cleanSubject(sub) {
  return sub.replace(/free|urgent|click|offer/gi, "").trim();
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
      auth: { user: email, pass: password }
    });

    await transporter.verify();
  } catch {
    throw new Error("Wrong app password");
  }

  let sent = 0;

  for (let i = 0; i < list.length; i += BATCH_SIZE) {

    const batch = list.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map(async (to) => {

        if (!canSend(email)) return false;

        try {
          await transporter.sendMail({
            from: `"${sender}" <${email}>`,
            to,
            subject: cleanSubject(subject),

            // 🔥 BEST FOR INBOX
            text: message,

            headers: {
              "Reply-To": email,
              "List-Unsubscribe": `<mailto:${email}?subject=unsubscribe>`,
              "X-Mailer": "NodeMailer",
              "X-Priority": "3"
            }
          });

          return true;

        } catch {
          return false;
        }
      })
    );

    results.forEach(r => {
      if (r.status === "fulfilled" && r.value) sent++;
    });

    await delay(BATCH_DELAY + Math.random() * 600);
  }

  return sent;
};
