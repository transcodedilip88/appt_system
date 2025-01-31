const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken, verifyToken } = require("../middleware/authentication");
const send_mail = require("../middleware/sendmail");
const config = require("../config");
const { mongoose } = require("mongoose");

exports.bookAppointment = async (req, res) => {
  try {
    let { doctor, appointmentTime, updatedby, createdBy } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const token_decode = jwt.verify(token, config.SECRET);
    let patientId = token_decode.id;
    let currectTime = new Date();
    if (appointmentTime <= currectTime) {
      return res.status(401).json({ status: "please Enter Upcoming Time" });
    }

    const newAppointment = new appointmentModel({
      patient: patientId,
      doctor,
      appointmentTime,
      createdBy: patientId,
      updatedby: patientId,
    });

    await newAppointment.save();

    send_mail.Boocked_mail(token_decode.email);
    // console.log('mail has been send ',decode.email);
    res.status(200).json({
      status: "Appointment has been Booked",
      Appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    let { patient, doctor, status, startTime, endTime } = req.query;
    console.log(typeof endTime);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const token = req.headers.authorization.split(" ")[1];

    const token_decode = jwt.verify(token, config.SECRET);

    let patientId = token_decode.id;
    let doctorId = token_decode.id;
    let isAdmin = token_decode.role;

    let patientExists = await userModel.findById(patientId);
    let doctorExists = await doctorModel.findById(doctorId);

    if (!patientExists && !doctorExists && !isAdmin == "admin") {
      return res.status(401).json({ status: "Unuthorized" });
    }

    let matchConditions = {};

    if (patient) {
      matchConditions.patient = new mongoose.Types.ObjectId(patient);
    }
    if (doctor) {
      matchConditions.doctor = new mongoose.Types.ObjectId(doctor);
    }
    if (status) {
      matchConditions.status = status;
    }
    if (startTime) {
      matchConditions.startTime = startTime;
    }
    if (endTime) {
      matchConditions.endTime = endTime;
    }
    const documents = await appointmentModel
      .aggregate([
        {
          $match: matchConditions,
        },

        {
          $lookup: {
            from: "patients",
            let: { patient: "$patient" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$patient"] }],
                  },
                },
              },
            ],
            as: "patientData",
          },
        },
        {
          $lookup: {
            from: "doctors",
            let: { doctor: "$doctor" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$doctor"] }],
                  },
                },
              },
            ],
            as: "doctorData",
          },
        },
      ])
      .skip((page - 1) * limit)
      .limit(limit);
    res
      .status(200)
      .json({ status: "Appointments List", appointmnets: documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const id = req.params.id;
    let data = await appointmentModel.findById(id);
    res.status(200).json({ status: "success", appointment: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await appointmentModel.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true },
      req.body
    );
    let patientId = data.patient;
    const userId = await userModel.findOne(patientId);

    send_mail.appt_Updated(userId.email);
    console.log("object", userId.email);
    res.status(200).json({ status: "Update Sucess", newAppointment: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await appointmentModel.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );
    let patientId = data.patient;
    const userId = await userModel.findOne(patientId);

    send_mail.appt_cancelled(userId.email);
    console.log("Appointment cancelled");
    res
      .status(200)
      .json({ status: "Appointment cancelled", appointmentData: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
