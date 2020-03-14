const nodemailer = require("nodemailer");
const config = require("../utils/config");
const emailUsername = config.EMAIL_USERNAME;
const emailPassword = config.EMAIL_PASSWORD;

//toFName, toLName, toEmail ,code, username, password
const sendEmail = async (type, options) => {
  let transporter = await nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: emailUsername,
      pass: emailPassword
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let mailOptions = null;

  switch (type) {
    case "CONFIRM":
      mailOptions = {
        from: `"My Chat" <${emailUsername}>`,
        to: `${options.toFName} ${options.toLName} <${options.toEmail}>`,
        subject: "Welcome to MyChat | Email Validation",
        html: `<p> Please provide this verification code <b> ${options.code} </b> to MyChat to validate your email! </p>`
      };
      break;
    case "USERNAME":
      mailOptions = {
        from: `"My Chat" <${emailUsername}>`,
        to: `${options.toFName} ${options.toLName} <${options.toEmail}>`,
        subject: "My Chat | Forgot Username",
        html: `Your Username is: ${options.username}`
      };
      break;
    case "PASSWORD":
      mailOptions = {
        from: `"My Chat" <${emailUsername}>`,
        to: `${options.toFName} ${options.toLName} <${options.toEmail}>`,
        subject: "My Chat | Forgot Password",
        html: `<p> Your temporary password is <b>${options.password} </b> Please go into the MyChat app and change your password </p>`
      };
      break;
  }
  transporter.sendMail(mailOptions)

};

module.exports = { sendEmail };
