const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phone: {
      countryCode: { type: String, default: "+1" },
      mobileNumber: { type: String, default: "" },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["patient", "admin"],
      default: "patient",
    },
    twoFactorAuthCode: { type: Number, default: 1111 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("patients", userSchema);
