const { appointmentModel } = require("../models/appointmentModel");
const { doctorModel } = require("../models/doctorModel");
const { userModel } = require("../models/userModels");

const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor data fetch success",
      data: doctor,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error in Fetching Doctor Details",
      success: false,
      err,
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      {
        userId: req.body.userId,
      },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      err,
    });
  }
};

const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({
      _id: req.body.doctorId,
    });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single Doctor Info Fetched",
      data: doctor,
    });
  } catch (err) {
    console.error("Error in fetching single doctor info:", err);
    res.status(500).send({
      success: false,
      message: "Error in fetching single doctor info",
      error: err.message,
    });
  }
};

const getDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({
      userId: req.body.userId,
    });
    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
    });

    res.status(200).send({
      success: true,
      message: "Doctor Appointments fetch Success",
      data: appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error in doc appointments",
      err,
    });
  }
};

const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });

    const notification = user.notification;
    notification.push({
      type: "Status Updated",
      message: `your appointment has been updated ${status}`,
      onClickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Your appointment status has been updated",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error in Update Status",
      err,
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  getDoctorAppointmentsController,
  updateStatusController,
};
