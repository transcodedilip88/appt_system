const doctorModel = require("../models/doctorModel");
const { errors } = require("../utils");
const { mongoService, mailService } = require("../services");
let messages = require("../config/messages.json");
const { generateToken, verifyToken } = require("../middleware/authentication");

exports.addDoctor = async (req, res) => {

 let isAdmin = req.user.role;
 if(isAdmin ==='patient'){
      return res.status(400).json({status:'admin not found'})
    }
  try {
    let {
      name,
      specialization,
      email,
      phone,
      availability,
      isBlocked,
      isDeleted,
    } = req.body;

    const checkIfAlreadyExists = await mongoService.getFirstMatch(
      doctorModel,
      {
        $or: [{ email: { $regex: email, $options: "i" } }],
      },
      {},
      { lean: true }
    );

    if (checkIfAlreadyExists) {
      res.status(400).json({ status: "email alredy difined" });
    }

    const newDoctor = {
      name,
      specialization,
      email,
      phone,
      availability,
      isBlocked,
      isDeleted,
    };

    const doctors = await mongoService.createData(doctorModel, newDoctor);

    const playload = {
      id: doctors.id,
      email: doctors.email,
    };

    const token = generateToken(playload);

    res
      .status(200)
      .json({ status: "success", doctordata: doctors, token: token });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllDoctor = async (req, res) => {
  try {
    let { specialization, search,} =
      req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

   let isAdmin = req.user.role;
 if(isAdmin ==='patient'){
      return res.status(400).json({status:'admin not found'})
    }

    let matchConditions = {
      isDeleted: false
    };

    let g = await doctorModel.find()
    console.log(g.availability);

    if (specialization) {
      matchConditions.specialization = specialization;
    }

    if (search) {
      matchConditions.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const doctors = await doctorModel
      .find(matchConditions)
      .skip((page - 1) * limit)
      .limit(limit);
    const d = await doctorModel.find();
    res.status(200).json({ status: "doctor List", doctors });
  } catch (error) {
    console.log(error);
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const id = req.params.id;

   let isAdmin = req.user.role;
 if(isAdmin ==='patient'){
      return res.status(400).json({status:'admin not found'})
    }
    let doctorCriteria = {
      _id: id,
      isDeleted: false,
    };

    const doctors = await doctorModel.findById(doctorCriteria);

    if (!doctors) {
      throw new errors.NotFound(messages.DATA_NOT_FOUND);
    }

    let response = {
      data: doctors,
    };

    res.status(200).send({ message: messages.SUCCESS, response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDoctorById = async (req, res) => {
  try {
    let { name, specialization, phone, availability } = req.body;

    const updateDoctor = {
      name,
      specialization,
      phone,
      availability,
    };

    const id = req.params.id;
    let role = req.user.role;

    if (!role == "admin") {
      return res.status(401).json({ status: "Admin not found" });
    }

    const doctors = await doctorModel.findByIdAndUpdate(id, updateDoctor, {
      new: true,
    });

    res.status(200).json({ status: "update success", doctors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDoctorById = async (req, res) => {
  try {
    const id = req.params.id;
   let isAdmin = req.user.role;
 if(isAdmin ==='patient'){
      return res.status(400).json({status:'admin not found'})
    }

    const doctors = await doctorModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    res.status(200).json({ status: "delete success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
