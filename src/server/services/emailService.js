const nodemailer = require("nodemailer");
const {
  confirmEmail,
  forgotUserEmail,
  forgotPassEmail,
} = require("./emailTemplates");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const config = require("../../../utils/config");
const emailUsername = config.EMAIL_USERNAME;
const emailPassword = config.EMAIL_PASSWORD;
const clientID = config.CLIENT_ID;
const clientSecret = config.CLIENT_SECRET;
const refreshToken = config.REFRESH_TOKEN;

const oauth2Client = new OAuth2(
  clientID,
  clientSecret,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.credentials = {
  refresh_token: refreshToken,
};

let accessToken;
oauth2Client.getAccessToken().then(function (value) {
  accessToken = value.token;
});

const sendEmail = (type, options) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: emailUsername,
      pass: emailPassword
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let mailOptions;
  switch (type) {
    case "CONFIRM":
      mailOptions = {
        from: `"My Chat" <${emailUsername}>`,
        to: `${options.toFullName} <${options.toEmail}>`,
        subject: "Welcome to MyChat | Email Validation",
        html: confirmEmail(options.toFullName,options.code),
      };
      break;
    case "USERNAME":
      mailOptions = {
        from: `"My Chat" <${emailUsername}>`,
        to: `${options.toFullName} <${options.toEmail}>`,
        subject: "My Chat | Forgot Username",
        html: forgotUserEmail(options.toFullName, options.username),
      };
      break;
    case "PASSWORD":
      mailOptions = {
        from: `"My Chat" <${emailUsername}>`,
        to: `${options.toFullName} <${options.toEmail}>`,
        subject: "My Chat | Forgot Password",
        html: forgotPassEmail(options.toFullName, options.password),
      };
      break;
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + info.response);
    }
  });
};

module.exports = { sendEmail };
