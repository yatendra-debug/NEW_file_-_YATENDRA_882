const nodemailer = require("nodemailer");

module.exports = (email, password) => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: email, pass: password }
  });
};
