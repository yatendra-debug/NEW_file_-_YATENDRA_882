const sendMail = require("../services/mailService");
const delay = require("../utils/delay");
const canSend = require("../utils/rateLimiter");

module.exports = async function (data) {
  const { email, password, sender, subject, message, recipients } = data;

  const list = recipients
    .split(/[\n,]+/)
    .map(e => e.trim())
    .filter(Boolean);

  for (let i = 0; i < list.length; i++) {

    // ✅ RATE LIMIT CHECK
    if (!canSend(email)) {
      console.log("⛔ Limit reached (27/hour). Wait for reset.");
      break;
    }

    try {
      await sendMail({
        email,
        password,
        sender,
        to: list[i],
        subject,
        message,
      });

      // ✅ RANDOM SAFE DELAY (5–9 sec)
      const randomDelay = 5000 + Math.random() * 4000;
      await delay(randomDelay);

    } catch (err) {
      console.log("❌ Failed:", list[i]);
    }
  }
};
