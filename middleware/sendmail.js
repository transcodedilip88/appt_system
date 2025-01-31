const config = require("../config");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(config.clientID, config.clientSecret);
OAuth2_client.setCredentials({ refresh_token: config.refreshToken });

async function Boocked_mail(recipient) {
  try {
    const accessToken = await OAuth2_client.getAccessToken();
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: config.user,
        clientId: config.clientID,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: config.user,
      to: recipient,
      subject: "Appointment has Boock",
      text: `Your Appontment has been boock`,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function appt_Updated(recipient) {
  try {
    const accessToken = await OAuth2_client.getAccessToken();
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: config.user,
        clientId: config.clientID,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: config.user,
      to: recipient,
      subject: "Appointment update",
      text: `Your Appontment has been update`,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
async function appt_cancelled(recipient) {
  try {
    const accessToken = await OAuth2_client.getAccessToken();
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: config.user,
        clientId: config.clientID,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: config.user,
      to: recipient,
      subject: "Appointment Cancelled",
      text: `Your Appontment has been Cancelled`,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
async function login(recipient) {
  try {
    const accessToken = await OAuth2_client.getAccessToken();
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: config.user,
        clientId: config.clientID,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: config.user,
      to: recipient,
      subject: "login success",
      text: `login successfully`,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
async function patientupcoming_appt(recipient) {
  try {
    const accessToken = await OAuth2_client.getAccessToken();
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: config.user,
        clientId: config.clientID,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: config.user,
      to: recipient,
      subject: "upcoming appointment",
      text: `your appointments is upcoming`,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
async function doctorApptUpcoming(recipient) {
  try {
    const accessToken = await OAuth2_client.getAccessToken();
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: config.user,
        clientId: config.clientID,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: config.user,
      to: recipient,
      subject: "upcoming appointment",
      text: `your appointments is upcoming`,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
module.exports = {
  Boocked_mail,
  appt_Updated,
  appt_cancelled,
  login,
  patientupcoming_appt,
  doctorApptUpcoming,
};
