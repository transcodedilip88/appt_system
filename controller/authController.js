const usermodel = require("../models/userModel");
let messages = require("../config/messages.json");
const { generateToken, verifyToken } = require("../middleware/authentication");
const send_mail = require("../middleware/sendmail");
const config = require("../config");
const jwtauth = require("jsonwebtoken");
const { errors, jwt } = require("../utils");
const { mongoService, mailService } = require("../services");
const universalFunctions = require("../lib/universal-functions");

exports.register = async (req, res) => {
  try {
    let { name, email, password, role, phone, isDeleted, isBlocked } = req.body;
    let body = req.body;

    if (password) {
      const passwordHash = await universalFunctions.encryptData(password);
      body.password = passwordHash;
    }

    const checkIfAlreadyExists = await mongoService.getFirstMatch(
      usermodel,
      {
        $or: [{ email: { $regex: email, $options: "i" } }],
        isDeleted: false,
      },
      {},
      { lean: true }
    );

    if (checkIfAlreadyExists) {
      return res.status(400).json({ status: "email alredy difined" });
    }

    if (password) {
      const passwordHash = await universalFunctions.encryptData(password);
      body.password = passwordHash;
    }

    const newRegister = {
      name,
      email,
      password: body?.password,
      role,
      phone,
      isDeleted,
      isBlocked,
    };

    const authData = await mongoService.createData(usermodel, newRegister);

    const playload = {
      name: authData.name,
      email: authData.email,
      role: authData.role,
    };

    const token = generateToken(playload);

    res
      .status(200)
      .json({ status: "success", userdata: authData, token: token });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await usermodel.findOne({ email: email });

    if (!user) {
      throw new errors.BadInputError(messages.INVALID_CREDENTIALS);
    } else if (
      !(await universalFunctions.compareBcryptPassword(password, user.password))
    ) {
      throw new errors.BadInputError(messages.INVALID_CREDENTIALS);
    }

    if (user.isDeleted) {
      throw new errors.BadInputError(messages.ACCOUNT_DELETED_BY_ADMIN);
    }
    if (user.isBlocked) {
      throw new errors.BadInputError(messages.ACCOUNT_BLOCKED_BY_ADMIN);
    }

    const playload = {
      id: user?.id,
      email: user?.email,
      role: user?.role,
    };

    let twoFactorAuthCode = await universalFunctions.generate_otp();

    await usermodel.findByIdAndUpdate(user.id, {
      $set: {
        twoFactorAuthCode: twoFactorAuthCode,
        otp: twoFactorAuthCode,
      },
    });

    const token = generateToken(playload);

    send_mail.login(user.email, twoFactorAuthCode);

    res.status(200).json({ status: "Login Success ", token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    let { token, email } = req.body;

    let decode = jwt.verify(token, config.SECRET);
    let isemail = decode.email;
    let mail = usermodel.findOne({ email: isemail });

    if ((email = mail)) {
      return res.status(200).json({ status: "logout success" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    let user = await usermodel.findOne({ email: email });

    if (!user) throw new errors.NotFound(messages.NOT_ASSOCIATED);
    const token = { id: user?.id, name: user?.name };

    const forgotPasswordToken = jwtauth.sign(token, user.password);
    console.log(forgotPasswordToken);
    send_mail.forgotPassword(user.email, forgotPasswordToken);
    res
      .status(200)
      .json({ status: "mail has been send to your register email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { verifyToken, newPassword } = req.body;
    const { id: id } = jwt.decode(verifyToken);
    let userData = await usermodel.findById(id);
    if (!userData)
      throw new errors.BadInputError(messages.INVALID_VERIFICATION_TOKEN);

    jwtauth.verify(verifyToken, userData.password);

    console.log(">>>>>>", userData.password);
    const passwordHash = await universalFunctions.encryptData(newPassword);
    const oldPassword = await universalFunctions.compareBcryptPassword(
      newPassword,
      userData.password
    );

    if (oldPassword) {
      return res
        .status(400)
        .json({ status: "old password and new password has been same " });
    }

    userData.password = passwordHash;
    const updateFields = {
      $set: {
        password: userData.password,
        isBlocked: false,
      },
    };

    await usermodel.findByIdAndUpdate(id, updateFields);

    send_mail.resetPassword(userData.email, userData.name);
    res.status(200).send({ message: messages.PASSWORD_CHANGED });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verify = async (req, res) => {
  try {
    const { verifyToken, otp } = req.body;
    const [err, decoded] = await jwt.verify(verifyToken, config.SECRET);
    if (err) throw new errors.Unauthorized(messages.INVALID_VERIFICATION_TOKEN);

    const { id } = decoded;

    let user = await usermodel.findById(id);
    if (!user)
      throw new errors.Unauthorized(messages.INVALID_VERIFICATION_TOKEN);
    else if (otp != user.twoFactorAuthCode) {
      throw new errors.BadInputError(messages.INVALID_OTP);
    }

    let userUpdate = await usermodel.findByIdAndUpdate(
      id,
      {
        $set: { twoFactorAuthCode: " " },
      },
      { new: true }
    );

    res.status(200).json({ message: messages.OTP_VARIFIED, data: userUpdate });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
