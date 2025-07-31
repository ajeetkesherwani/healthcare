// routes/call.route.js
const express = require("express");
const router = express.Router();
const Appointment = require("../../models/bookedAppointment");
const generateAgoraToken = require("../../utils/agora");
const AppError = require("../../utils/AppError");
const { successResponse, errorResponse } = require("../../utils/responseHandler");

router.get("/join-call/:appointmentId/:uid", async (req, res) => {
    const { appointmentId, uid } = req.params;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
        errorResponse(res, "Appointment not found", 404);
    }

    const { appointmentDate, timeSlot } = appointment;

    if (!appointmentDate || !timeSlot || !timeSlot.includes("-")) {
        errorResponse(res, "Invalid appointment date or time slot", 400);
    }

    const [startTimeStr, endTimeStr] = timeSlot.split(" - ").map(t => t.trim()); 
    const [startHour, startMinute] = startTimeStr.split(":").map(Number);
    const [endHour, endMinute] = endTimeStr.split(":").map(Number);

    // Convert appointmentDate (UTC) to local JS date
    const baseDate = new Date(appointmentDate); 

    const start = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        startHour,
        startMinute
    );

    const end = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        endHour,
        endMinute
    );

    const now = new Date();

    if (now < start) {
        errorResponse(res, "Call has not started yet.", 400);
    }

    if (now > end) {
        errorResponse(res, "Call has already ended.", 400);
    }

    const appID = process.env.AGORA_APP_ID;
    // Fallback if channelName is not stored in DB
    const finalChannelName = `appointment_${appointmentId}`;
    
    const token = generateAgoraToken(finalChannelName, uid, 1, (end - now) / 1000);

    data = {
        appID,
        token,
        channelName: finalChannelName,
        expiresInSeconds: Math.floor((end - now) / 1000),                                     
        validUntil: end.toISOString()
    };
    successResponse(res,"Call token generated successfully",data, 200);    
});

module.exports = router;
