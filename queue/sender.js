const nodemailer = require("nodemailer");

const HOURLY_LIMIT = 27;
const PARALLEL = 2;
const BASE_DELAY = 200;

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

  const list = recipients.split(/[\n,]+/).map(e => e.trim()).filter(Boolean);

  // 🔥 transporter check (WRONG PASSWORD HANDLE)
  let transporter;

  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: email, pass: password },
    });

    await transporter.verify(); // 🔥 check login
  } catch (err) {
    throw new Error("Wrong app password");
  }

  let sentCount = 0;

  for (let i = 0; i < list.length; i++) {

    if (!canSend(email)) break;

    try {
      await transporter.sendMail({
        from: `"${sender}" <${email}>`,
        to: list[i],
        subject,
        html: `<p>${message}</p>`,
      });

      sentCount++;

      await delay(BASE_DELAY + Math.random() * 500);

    } catch (e) {
      // skip failed mail
    }
  }

  return sentCount;
};
