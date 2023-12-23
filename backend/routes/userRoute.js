const express = require("express");

const router = express.Router();

const {
  loginController,
  registerController,
  authController,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", loginController);

router.post("/register", registerController);

router.post("/getUserData", authMiddleware, authController);
module.exports = router;
