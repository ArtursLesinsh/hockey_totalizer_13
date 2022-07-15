const express = require("express");
const router = express.Router();
const { register, login, update } = require("./auth");
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update").put(update);
module.exports = router