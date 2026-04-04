const createTransport = require("../config/smtp");
const delay = require("../utils/delay");
const canSend = require("../utils/rateLimiter");
const sendMail = require("../services/mailService");

const BASE_DELAY = 500;

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
    transporter = createTransport(email, password);
    await transporter.verify();
  } catch {
    throw new Error("Wrong app password");
  }

  let sent = 0;

  for (let to of list) {

    if (!canSend(email)) break;

    const ok = await sendMail(transporter, {
      from: `"${sender}" <${email}>`,
      to,
      subject,

      // 🔥 EXACT LINE PRESERVE
      text: message,

      headers: {
        "Reply-To": email,
        "List-Unsubscribe": `<mailto:${email}?subject=unsubscribe>`
      }
    });

    if (ok) sent++;

    await delay(BASE_DELAY + Math.random() * 800);
  }

  return sent;
};
