const createTransporter = require("../config/smtp");

async function sendMail({ email, password, sender, to, subject, message }) {
  const transporter = createTransporter(email, password);

  await transporter.sendMail({
    from: `"${sender}" <${email}>`,
    to,
    subject,
    html: `<p>${message}</p>`,
  });

  console.log("✅ Sent:", to);
}

module.exports = sendMail;
