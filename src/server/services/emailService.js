const nodemailer = require("nodemailer");
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
  refresh_token: refreshToken
};

let accessToken;
oauth2Client.getAccessToken().then(function(value) {
  accessToken = value.token;
});

const sendEmail = (type, options) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      type: "OAuth2",
      user: emailUsername,
      password: emailPassword,
      clientId: clientID,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      accessToken: accessToken
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let mailOptions;
  switch (type) {
    case "CONFIRM":
      mailOptions = {
        from: `"My Chat" <${emailUsername}>`,
        to: `${options.toFullName} <${options.toEmail}>`,
        subject: "Welcome to MyChat | Email Validation",
        html: `<p> Please provide this verification code <b> ${options.code} </b> to MyChat to validate your email! </p>`
      };
      break;
    case "USERNAME":
      mailOptions = {
        from: `"My Chat" <${emailUsername}>`,
        to: `${options.toFullName} <${options.toEmail}>`,
        subject: "My Chat | Forgot Username",
        html: `Your Username is: ${options.username}`
      };
      break;
    case "PASSWORD":
      mailOptions = {
        from: `"My Chat" <${emailUsername}>`,
        to: `${options.toFullName} <${options.toEmail}>`,
        subject: "My Chat | Forgot Password",
        html: `<p> Your temporary password is <b>${options.password} </b> Please go into the MyChat app and change your password </p>`
      };
      break;
  }
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + info.response);
    }
  });
};

module.exports = { sendEmail };