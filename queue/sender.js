const sendMail = require("../services/mailService");
const delay = require("../utils/delay");
const canSend = require("../utils/rateLimiter");

module.exports = async data => {
  const { email, password, sender, subject, message, recipients } = data;

  const list = recipients.split(/[\n,]+/).map(e => e.trim()).filter(Boolean);

  for (let i = 0; i < list.length; i++) {

    if (!canSend(email)) {
      console.log("Limit reached (27/hour)");
      break;
    }

    try {
      await sendMail({
        email,
        password,
        sender,
        to: list[i],
        subject,
        message
      });

      await delay(5000 + Math.random() * 4000);

    } catch (e) {
      console.log("Fail:", list[i]);
    }
  }
};
