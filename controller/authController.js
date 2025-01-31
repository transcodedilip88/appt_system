const usermodel = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../middleware/authentication");
const send_mail = require("../middleware/sendmail");
const config = require('../config')


exports.register = async (req, res) => {
  try {
    let { name, email, password, role, phone ,isDeleted,isBlocked} = req.body;
    let bcryptpassword = await bcrypt.hash(password, 10);
    password = bcryptpassword;

    let checkEmail = await usermodel.findOne({ email: email });
    if (checkEmail) {
      return res.status(401).json({ status: "user alredy exists" });
    }

    let checkIsBlocked = await usermodel.findOne({ isBlocked: true });
    if (checkIsBlocked) {
      return res.status(401).json({ status: "user is blocked" });
    }
    const newRegister = {
      name,
      email,
      password,
      role,
      phone,
      isDeleted,
      isBlocked,
    };

    const data = await usermodel.create(newRegister);

    const playload = {
      name: data.name,
      email: data.email,
      password: data.password,
      isDeleted: data.isDeleted,
      isBlocked: data.isBlocked,
      role: data.role,
    };

    const token = generateToken(playload);

    res.status(200).json({ status: "success", userdata: data, token: token });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await usermodel.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ status: "invalide Email" });
    }
    const isPasswordValide = await bcrypt.compare(password, user.password);

    if (!isPasswordValide) {
      return res.status(401).json({ status: "invalide Password" });
    }
    let checkIsBlocked = await usermodel.findOne({ isBlocked: true });
    
    if (checkIsBlocked) {
      return res.status(401).json({ status: "user is blocked" });
    }

    const playload = {
      id: user.id,
      email: user.email,
      password: user.password,
    };

    const token = generateToken(playload);
    send_mail.login(req.body.email);

    res.status(200).json({ status: "Login Success ", token: token });
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async (req, res) => {
  try {
    let { token, email } = req.body;

    let decode = jwt.verify(token, config.SECRET);
    let isemail = decode.email;
    // console.log("<<<>>>", isemail);

    let mail = usermodel.findOne({ email: isemail });

    if ((email = mail)) {
      return res.status(200).json({ status: "logout success" });
    }
  } catch (error) {
    console.log(error);
  }
};
