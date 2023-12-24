const { doctorModel } = require("../models/doctorModel");

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

module.exports = { getDoctorInfoController };
