const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  getRange: async (startDate, endDate, diffIn) => {
    let difference = moment(startDate).diff(endDate, diffIn);
    return difference;
  },

  compareBcryptPassword: async (password, dbPassword) => {
    return bcrypt.compareSync(password, dbPassword);
  },

  encryptData: async (keyword) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(keyword, salt);
    return hash;
  },

  generateRandomString: async (length) => {
    return randomstring.generate({
      length: length ? length : 30,
      charset: "alphanumeric",
    });
  },

  generate_otp: async () => {
    try {
      return Math.floor(1000 + Math.random() * 9000);
    } catch (err) {
      throw err;
    }
  },

  covertLocalTimeToUtc: async (date, timeZoneId) => {
    try {
      let formattedDate;
      if (date) {
        formattedDate = moment(new Date(date))
          .tz(timeZoneId)
          .format("YYYY-MM-DDTHH:mm:ssZ");
      }
      return formattedDate;
    } catch (error) {
      return "NA";
    }
  },

  checkHistoryAtSave: async (key, updatedEntity, fromValue, toValue) => {
    if (fromValue || toValue) {
      if (fromValue !== toValue) {
        updatedEntity.push({
          entityName: key,
          fromValue: fromValue || "",
          toValue: toValue || "",
        });
      }
    }
  },

  extractLinks: async (text) => {
    const regex = /(https?:\/\/[^\s]+)/gi;
    return text.match(regex) || null;
  },
};

module.exports.resetPasswordTemplate = (link, name) => {
  return `
       <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <title>Welcome Email</title>
                <style>
                    .mainheader { margin: 0 auto; padding: 0 20px; background-color: #f3f3f4; max-width: 700px; }
                    td { color: #00234b; font-family: Arial, sans-serif; font-size: 15px; }
                    a { text-decoration: none; }
                </style>
            </head>
            <body>
                <table class="mainheader">
                    <tr>
                        <td style="padding:10px">
                            <p>Hello ${name},
                            <br><br>Please <a href=${link}>click here</a> to reset your password.</p>
                            <p>Thank You,<br></p>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    </html>
    `;
};

module.exports.get2FACodeTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>2FA code Template</title>
      </head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <title>Welcome Email</title>
                <style>
                    .mainheader { margin: 0 auto; padding: 0 20px; background-color: #f3f3f4; max-width: 700px; }
                    td { color: #00234b; font-family: Arial, sans-serif; font-size: 15px; }
                    a { text-decoration: none; }
                </style>
            </head>
            <body>
                <table class="mainheader">
                    <tr>
                        <td style="padding:10px">
                            <p> Hello ${name} </p>
                            <p>${otp} is your Two factor authentication code for Login.</p>
                            <p>Thank You,<br></p>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
      </body>
    </html>
    `;
};
