const mongoose = require("mongoose");
const { Schema } = mongoose;

const SymptomsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Symptoms", SymptomsSchema);
