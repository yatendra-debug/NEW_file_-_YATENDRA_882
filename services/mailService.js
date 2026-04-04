const createTransport = require("../config/smtp");

module.exports = async ({ email, password, sender, to, subject, message }) => {
  const transporter = createTransport(email, password);

  await transporter.sendMail({
    from: `"${sender}" <${email}>`,
    to,
    subject,
    html: `<p>${message}</p>`,
  });

  console.log("Sent:", to);
};
