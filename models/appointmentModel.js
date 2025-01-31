const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "patient" },
    updatedby: { type: mongoose.Schema.Types.ObjectId, ref: "patient" },
    appointmentTime: { type: Date, default: Date.now()},
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("appointments", appointmentSchema);
