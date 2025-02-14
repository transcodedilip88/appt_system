const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");
const doctorModel = require("../models/doctorModel");
const { mongoService, mailService } = require("../services");
const send_mail = require("../middleware/sendmail");
const { mongoose } = require("mongoose");

exports.bookAppointment = async (req, res) => {
  try {
    let { doctor, appointmentTime, updatedby, createdBy,patientd } = req.body;
    let patientId = req.user.id;
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

    const appointments = await mongoService.createData(
      appointmentModel,
      newAppointment
    );

    send_mail.Boocked_mail(req.user.email);
    res.status(200).json({
      status: "Appointment has been Booked",
      Appointment: appointments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    let { patient, doctor, status, startTime, endTime } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let patientId = req.user.id;
    let doctorId = req.user.id;

    let patientExists = await userModel.findById(patientId);
    let doctorExists = await doctorModel.findById(doctorId);

    if (!patientExists && !doctorExists) {
      return res.status(401).json({ status: "Unuthorized" });
    }

    let matchConditions = {
    };
    if (startTime && endTime) {
      matchConditions.appointmentTime = {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      };
    }
    if (patient) {
      matchConditions.patient = new mongoose.Types.ObjectId(patient);
    }
    if (doctor) {
      matchConditions.doctor = new mongoose.Types.ObjectId(doctor);
    }
    if (status) {
      matchConditions.status = status;
    }

    const appointments = await appointmentModel
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
      .json({ status: "Appointments List", appointmnets: appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const id = req.params.id;
    let appointments = await appointmentModel.findById(id);
    res.status(200).json({ status: "success", appointment: appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    let { appointmentTime, status } = req.body;
    let body = req.body;
    const id = req.params.id;
    const appointments = await appointmentModel.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true },
      body
    );
    let patientId = appointments.patient;
    const userId = await userModel.findOne(patientId);

    send_mail.appt_Updated(userId.email);
    res
      .status(200)
      .json({ status: "Update Sucess", newAppointment: appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const appointments = await appointmentModel.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );
    let patientId = appointments.patient;
    const userId = await userModel.findOne(patientId);

    send_mail.appt_cancelled(userId.email);
    console.log("Appointment cancelled");
    res
      .status(200)
      .json({ status: "Appointment cancelled", appointmentData: appointments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
