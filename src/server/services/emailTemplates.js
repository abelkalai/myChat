const confirmEmail = (fullName, code) => {
  return `<p> Hi ${fullName}, </p> 
            <p> Please provide this verification code <b> ${code} </b> to MyChat to validate your email! </p>
            <p> Best Regards, </p>
            <p> The MyChat Team </p> 
            <p> <br> Please do not respond to this email, it is a no-reply email address</p>`;
};

const forgotUserEmail = (fullName, username) => {
  return `<p> Hi ${fullName}, </p> 
            <p> Your Username is: <b> ${username} </b> </p>
            <p> Best Regards, </p>
            <p> The MyChat Team </p> 
            <p> <br> Please do not respond to this email, it is a no-reply email address</p>`;
};

const forgotPassEmail = (fullName, password) => {
  return `<p> Hi ${fullName}, </p> 
            <p> Your temporary password is <b>${password} </b> Please go into the MyChat app and change your password. </p>
            <p> Best Regards, </p>
            <p> The MyChat Team </p> 
            <p> <br> Please do not respond to this email, it is a no-reply email address</p>`;
};

module.exports = { confirmEmail, forgotUserEmail, forgotPassEmail };
