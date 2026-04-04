const sendMail = require("../services/mailService");
const delay = require("../utils/delay");

module.exports = async function (data) {
  const { email, password, sender, subject, message, recipients } = data;

  // split emails
  const list = recipients
    .split(/[\n,]+/)
    .map(e => e.trim())
    .filter(Boolean);

  for (let i = 0; i < list.length; i++) {
    try {
      await sendMail({
        email,
        password,
        sender,
        to: list[i],
        subject,
        message,
      });

      // SAFE DELAY (5–10 sec random)
      const randomDelay = 5000 + Math.random() * 5000;
      await delay(randomDelay);

    } catch (err) {
      console.log("❌ Failed:", list[i]);
    }
  }
};
