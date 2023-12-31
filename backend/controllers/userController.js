const { userModel } = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { doctorModel } = require("../models/doctorModel");
const { appointmentModel } = require("../models/appointmentModel");
const moment = require("moment");

const registerController = async (req, res) => {
  try {
    const existUser = await userModel.findOne({ email: req.body.email });
    if (existUser) {
      return res
        .status(200)
        .send({ success: false, message: "Email already exist" });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res
      .status(200)
      .send({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: `Register Controller ${err.message}` });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid Email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .send({ message: "Login Success", token: token, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: `Error in Login Controller ${err.message}`,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User not found" });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: `Error in Auth Controller ${err.message}`,
    });
  }
};

const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For a Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(200).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      err,
      message: "Error while applying for doctor",
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seenNotification = user.seenNotification;
    const notification = user.notification;
    seenNotification.push(...notification);
    user.notification = [];
    user.seenNotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error in Notification Controller",
      success: false,
      err,
    });
  }
};

const deleteNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      err,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors List fetched successfully",
      data: doctors,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      err,
      message: "Error while fetching Doctor",
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH-mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    const user = await userModel.findOne({ _id: req.body.userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const notification = user.notification;
    notification.push({
      type: "New-Appointment-Request",
      message: `A new appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error while booking appointment",
      error: err.message,
    });
  }
};

const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH-mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH-mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointment Available",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error in Booking",
      err,
    });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch Successfully",
      data: appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error in User Appointments",
      err,
    });
  }
};

module.exports = {
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
};
