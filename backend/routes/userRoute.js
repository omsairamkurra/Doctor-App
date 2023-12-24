const express = require("express");

const router = express.Router();

const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteNotificationController,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");

//Login || POST
router.post("/login", loginController);
//Register || POST
router.post("/register", registerController);
//Auth || POST
router.post("/getUserData", authMiddleware, authController);
//Apply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);
//Notification Doctor || POST
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteNotificationController
);

module.exports = router;
