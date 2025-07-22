const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    mobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    dob: { type: Date },
    email: { type: String, trim: true, lowercase: true },
    profileImage: { type: String, default: "" },
    address: { type: String, default: "" },
    userType: {
      type: String,
      enum: ["veg", "nonveg", "other"],
      default: "other",
    },

    // New fields
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
      default: "Unknown",
    },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed", "unknown"],
      default: "unknown",
    },
    height: { type: Number }, // in centimeters
    weight: { type: Number }, // in kilograms

    status: { type: Boolean, default: true },
    otp: { code: String, expiresAt: Date },
    lastLogin: { type: Date },
    isVerified: { type: Boolean, default: false },
    lat: { type: String, default: "" },
    long: { type: String, default: "" },
    deviceInfo: { deviceId: String, deviceModel: String, osVersion: String },

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
