const nodemailer = require("nodemailer");
const config = require('../utils/config')
const emailUsername = config.EMAIL_USERNAME;
const emailPassword = config.EMAIL_PASSWORD;

const sendEmail = async (type, toFName, toLName, toEmail ,code) => {
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

  let mailContent=null

  switch (type){
    case 'CONFIRM':
      mailContent = {
        from: `"My Chat" <${emailUsername}>`,
        to: `${toFName} ${toLName} <${toEmail}>`,
        subject: "Welcome to MyChat | Email Validation",
        text: "Please provide the verification below to MyChat to validate your email!"
      };
  }
  

  transporter.sendMail(mailContent)
  
};

module.exports = { sendEmail };
