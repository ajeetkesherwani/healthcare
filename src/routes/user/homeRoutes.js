const express = require("express");
const router = express.Router();
const {
  userAuthenticate,
} = require("../../controllers/user/authController/userAuthenticate");

const { home } = require("../../controllers/user/homeController/home");
const {
  symtomsList,
} = require("../../controllers/user/homeController/symtomsList");
const {
  getAllCategory,
} = require("../../controllers/user/homeController/getAllCategory");
const {
  getAllSymptoms,
} = require("../../controllers/user/homeController/getAllSymptoms");

router.get("/homeData", userAuthenticate, home);
router.get("/symtomsList/:name", userAuthenticate, symtomsList);
router.get("/getAllCategory", userAuthenticate, getAllCategory);
router.get("/getAllSymptoms", userAuthenticate, getAllSymptoms);
module.exports = router;
