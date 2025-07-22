const mongoose = require("mongoose");

const variantTypeSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Service"
    },
    variantName: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true });

const VariantType = mongoose.model("VariantType", variantTypeSchema);
module.exports = VariantType;