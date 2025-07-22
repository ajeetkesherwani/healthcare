const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    service_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    vendor_Id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    image: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["banner", "popupp", "other"],
        default: "other"
    },
    redirect_url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    }
}, { timestamps: true });

const Banners = mongoose.model("Banners", bannerSchema);

module.exports = Banners;