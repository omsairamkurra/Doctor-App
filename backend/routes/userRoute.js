const express = require("express");

const router = express.Router();

const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
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

router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

router.post("/book-appointment", authMiddleware, bookAppointmentController);

router.post(
  "/booking-availability",
  authMiddleware,
  bookingAvailabilityController
);

router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;
