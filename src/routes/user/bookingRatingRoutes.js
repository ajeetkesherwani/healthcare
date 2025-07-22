const express = require("express");
const {
  userAuthenticate,
} = require("../../controllers/user/authController/userAuthenticate");
const {
  createRatingReview,
} = require("../../controllers/user/ratingReviewController/createRatingReview");
const router = express.Router();

router.post("/create", userAuthenticate, createRatingReview);
console.log("Rating and Review routes loaded");
module.exports = router;
