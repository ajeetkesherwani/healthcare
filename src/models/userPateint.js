const mongoose = require("mongoose");

const userPateintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: ["true", "Name is required"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userPateint", userPateintSchema);
