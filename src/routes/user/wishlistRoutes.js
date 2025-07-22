const express = require("express");
const { createWishlist } = require("../../controllers/user/wishListController/createWishlist");
const { getWishlist } = require("../../controllers/user/wishListController/getWishlist");
const { deleteWishlist } = require("../../controllers/user/wishListController/deleteWishlist");
const router = express.Router();

router.post("/create", createWishlist);
router.get("/list/:user_Id", getWishlist);
router.delete("/delete/:id", deleteWishlist);

module.exports = router;