const express = require("express");
const {
  userAuthenticate,
} = require("../../controllers/user/authController/userAuthenticate");
const {
  createPateint,
} = require("../../controllers/user/userPateintController/createPateint");
const {
  getPateint,
} = require("../../controllers/user/userPateintController/getPateint");
const {
  deletePateint,
} = require("../../controllers/user/userPateintController/deletePateint");
const router = express.Router();

router.post("/create", userAuthenticate, createPateint);
router.get("/list", userAuthenticate, getPateint);
router.delete("/delete/:id", userAuthenticate, deletePateint);

module.exports = router;
