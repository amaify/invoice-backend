const express = require("express");
const authController = require("../controllers/authentication");

const router = express.Router();

router.post("/signup", authController.createUser);
router.post("/login", authController.userLogin);
router.post("/forgot-password", authController.forgotPassword);
router.put("/reset-password", authController.resetPassword);

module.exports = router;
