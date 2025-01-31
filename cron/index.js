const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");
const cron = require("node-cron");
const send_mail = require("../middleware/sendmail");
// const user  = 'solankidilip8326@gmail.com'
cron.schedule("* */4 * * *", async (req, res) => {
  try {
    const currentTime = new Date();
    const fourHoursLater = new Date(currentTime.getTime() + 4 * 60 * 60 * 1000);

    const appointmentData = await appointmentModel.findOne({
      appointmentTime: {
        $gte: currentTime,
        $lte: fourHoursLater,
      },
      status: "scheduled",
    });

    if (appointmentData === null) {
      return res.status(401).json({ status: "appointment not found" });
    }

    let patientId = appointmentData.patient;
    let doctorId = appointmentData.doctor;

    const userId = await userModel.findOne(patientId);
    const doctor = await doctorModel.findOne(doctorId);
    
    send_mail.patientupcoming_appt(userId.email);
    send_mail.doctorApptUpcoming(doctor.email);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
