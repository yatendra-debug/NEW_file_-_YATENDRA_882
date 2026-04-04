module.exports = async (transporter, mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch {
    return false;
  }
};
