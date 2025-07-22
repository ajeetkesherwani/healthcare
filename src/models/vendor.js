const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  type: {
    type: String,
    enum: ["doctor", "ambulance", "other"],
    default: "other",
  },
  symptoms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Symptoms",
    },
  ],
  Name: { type: String },
  mobile: { type: String, unique: true },
  dob: { type: String },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  profileImage: { type: String, defaul: "" },
  address: { type: String, default: "" },
  department: { type: [String], default: [] },
  qualification: { type: String, required: true },
  yearOfExp: { type: String, default: "0" },
  licOrRegNumber: { type: String, default: "" },
  certificate: { type: String, default: "" },
  state: { type: String, default: "" },
  district: { type: String, default: "" },
  pincode: { type: String, default: "" },
  lat: { type: String, default: "" },
  long: { type: String, default: "" },
  isEmergency: { type: Boolean, default: false },
  inClinicAvaialble: { type: Boolean, default: false },
  videoConsultAvailable: { type: Boolean, default: false },
  inClinicFee: { type: String, default: 0 },
  videoConsultFee: { type: String, default: 0 },

  // OTHERS
  openingTime: { type: String, default: "10:00 AM" },
  closingTime: { type: String, default: "09:00 PM" },
  lunchStart: { type: String },
  lunchEnd: { type: String },
  sessionTime: { type: Number },
  breakTime: { type: Number },
  selectDays: [],

  rating: { type: Number, default: 0 },
  otp: { type: String, default: "" },
  otpExpires: { type: Date, default: Date.now },
  commission: { type: Number, default: 0 },
  wallet_balance: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  agreementAccepted: { type: String, default: "true" },
  status: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
