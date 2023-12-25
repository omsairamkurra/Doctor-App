const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  getDoctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorController");

router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

router.post("/updateProfile", authMiddleware, updateProfileController);

router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

router.get(
  "/doctor-appointments",
  authMiddleware,
  getDoctorAppointmentsController
);

router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;
