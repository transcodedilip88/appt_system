const usermodel = require("../models/userModel");
const bcrypt = require("bcrypt");
let messages = require("../config/messages.json");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../middleware/authentication");
const send_mail = require("../middleware/sendmail");
const config = require("../config");
const { errors } = require("../utils");
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

    res.status(200).json({ status: "success", userdata: authData, token: token });
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
      id: user.id,
      email: user.email,
    };

    const token = generateToken(playload);
    send_mail.login(req.body.email);

    res.status(200).json({ status: "Login Success ", token: token });
  } catch (error) {
    res.status(400).json({error:error.message})
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
    console.log(error);
  }
};


exports.isAuth = (allowedRoles = []) => {
  return async (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    if (token) {
      try {
        const [err, decoded] = await jwt.verify(token, config.SECRET);
        if (err)
          throw new errors.Unauthorized(messages.INVALID_VERIFICATION_TOKEN);

        req.user = decoded;
        // req.token = token;

        console.log(req.user);
        if (allowedRoles.length === 0 || allowedRoles.includes(req.user.role)) {
          next();
        } else {
          return res
            .status(403)
            .json({
              message: "Access denied. You do not have the required role.",
            });
        }
      } catch (error) {
        console.log(error);
        return res
          .status(401)
          .json({ message: "Unauthorized", reason: "Invalid/Expired Token" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Authorization header is missing." });
    }
  };
};
