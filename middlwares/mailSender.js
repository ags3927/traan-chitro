const nodemailer = require('nodemailer');

let from = 'traanchitro@gmail.com';
let to = 'traanchitro@gmail.com';
let subject = 'Registration';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: from,
        pass: 'traanchitro-reg-inbox'
    }
});



let sendMail = async (req, res, next) => {
  if (res.locals.middlewareResponse.inserted) {
      let text = `${req.body.orgName} has requested for registration. Please check and verify.`;
      let mailOptions = {
          from,
          to,
          subject,
          text
      };
      await transporter.sendMail(mailOptions)
  }
  next();
};

module.exports = {
    sendMail
};


