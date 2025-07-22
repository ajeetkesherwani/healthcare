const mongoose = require("mongoose");

const category = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    symptoms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Symptoms",
      },
    ],
    type: {
      type: String,
      enum: ["veg", "nonveg", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", category);
module.exports = Category;
