const sgMail = require('@sendgrid/mail');
const { sendGrid_API_key, from } = require('../../../config/test');

sgMail.setApiKey(sendGrid_API_key);

const sendMail = async ({ email, subject, text, html }, cb) => {
  const message = {
    to: email, // for sending multiple provide array
    from: from,
    subject: subject,
    text: text,
    html: html
  }

  await sgMail.send(message);
    // .then(res => {
    //   console.log('Email send successfully');
    //   cb(null, res);
    // })
    // .catch(err => {
    //   console.log('Email send failed', err);
    //   cb(err, null);
    // })
}

exports.sendMail = sendMail;