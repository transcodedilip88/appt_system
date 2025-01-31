const doctorModel = require("../models/doctorModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { generateToken, verifyToken } = require("../middleware/authentication");
const config = require("../config");

exports.addDoctor = async (req, res) => {
  try {
    let { name, specialization, email, phone, availability } = req.body;

    let checkEmail = await doctorModel.findOne({ email: email });
    if (checkEmail) {
      return res.status(401).json({ status: "doctor already Exists" });
    }

    const newDoctor = {
      name,
      specialization,
      email,
      phone,
      availability,
    };

    const data = await doctorModel.create(newDoctor);

    const playload = {
      name: data.name,
      specialization: data.specialization,
      email: data.email,
      phone: data.phone,
      availability: data.availability,
    };

    const token = generateToken(playload);

    res.status(200).json({ status: "success", doctordata: data, token: token });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllDoctor = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const documents = await doctorModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ status: "doctor List", documents });
  } catch (error) {
    console.log(error);
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await doctorModel.findById(id);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDoctorById = async (req, res) => {
  try {
    const id = req.params.id;

    const token = req.headers.authorization.split(" ")[1];
    let decode = jwt.verify(token, config.SECRET);
    let role = decode.role;

    if (!role == "admin") {
      return res.status(401).json({ status: "Admin not found" });
    }

    const data = await doctorModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ status: "update success", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteDoctorById = async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.headers.authorization.split(" ")[1];
    let decode = jwt.verify(token, config.SECRET);
    let role = decode.role;
    if (!role == "admin") {
      return res.status(401).json({ status: "Admin not found" });
    }

    const data = await doctorModel.findByIdAndDelete(id);
    res.status(200).json({ status: "delete success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
