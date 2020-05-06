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



let sendMailHandler = async (req, res, next) => {
  try {
      if (res.locals.middlewareResponse.inserted) {
          let text = `${req.body.orgName} has requested for registration. Please check and verify.\nOrganization Details:\n${JSON.stringify(req.body, undefined, 2)}`;
          let mailOptions = {
              from,
              to,
              subject,
              text,
          };
          await transporter.sendMail(mailOptions)
      }
      next();
  } catch (e) {
      next();
      /// :/
  }
};

module.exports = {
    sendMailHandler
};


