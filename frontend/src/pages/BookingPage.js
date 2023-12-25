import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, TimePicker, message } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        console.log(res.data);
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          date: date,
          userInfo: user,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (err) {
      dispatch(hideLoading());
      console.log(err);
    }
  };
  const formatTimings = (timingsArray) => {
    if (timingsArray && timingsArray.length === 2) {
      const startTime = timingsArray[0];
      const endTime = timingsArray[1];
      return `${startTime} - ${endTime}`;
    }
    return "Not Available";
  };

  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/booking-availability",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      dispatch(hideLoading());
      console.log(err);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h1>Booking Page</h1>
      {doctors && (
        <div>
          <h4>
            Dr.{doctors.firstName} {doctors.lastName}
          </h4>
          <h4>Fees: {doctors.feesPerConsultation}</h4>
          <h4>Timings: {formatTimings(doctors.timings)}</h4>
          <div className="d-flex flex-column w-50">
            <DatePicker
              className="m-2"
              format="DD-MM-YYYY"
              onChange={(value) => {
                setDate(moment(value).format("DD-MM-YYYY"));
              }}
            />
            <TimePicker
              className="m-2"
              format="HH-mm"
              onChange={(value) => {
                setTime(moment(value).format("HH-mm"));
              }}
            />
            <button
              className="btn btn-primary mt-2"
              onClick={handleAvailability}
            >
              Check Availability
            </button>

            <button className="btn btn-dark mt-2" onClick={handleBooking}>
              Book Now
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BookingPage;
