const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookedAppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userPateint",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    orderId: {
      type: String,
      default: "",
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    reminder: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ["inClinic", "videoAppointment"],
      default: "In-Person",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Ongoing", "Completed", "Cancelled"],
      default: "Pending",
    },
    notes: {
      type: String,
      default: "",
    },
    // Reschedule tracking
    rescheduled: {
      type: Boolean,
      default: false,
    },
    rescheduleHistory: [
      {
        appointmentDate: Date,
        timeSlot: String,
        rescheduledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rescheduleReason: {
      type: String,
      default: "",
    },
    cancellReason: {
      type: String,
      default: "",
    },
    isReminder: {
      type: String,
      enum: ["0", "1"],
      default: "0",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BookedAppointment", BookedAppointmentSchema);
