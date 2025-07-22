const express = require("express");

const {
  adminAuthenticate,
} = require("../../controllers/admin/auth/adminAuthenticate");
const { getList } = require("../../controllers/admin/commonController/getList");

const router = express.Router();

router.get("/list/:type", adminAuthenticate, getList);

module.exports = router;
