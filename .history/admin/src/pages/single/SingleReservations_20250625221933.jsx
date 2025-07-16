import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance.js"

const Single = () => {
  const [user, setUser] = useState({});
  const [lodge, setLodge] = useState({});
  const [booking, setBooking] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { bookingId } = useParams();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        const bookingData = response.data;
        setBooking(bookingData);
        console.log(booking)

        const userId = bookingData.user._id;
        const lodgeId = bookingData.lodge._id;

        const userResponse = await axiosInstance.get(`/user/${userId}`);
        setUser(userResponse.data);

        const lodgeResponse = await axiosInstance.get(`/lodges/${lodgeId}`);
        setLodge(lodgeResponse.data);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <h2 className="sectionTitle">Información del huesped</h2>
            <h1 className="item">{user.first_name} {user.last_name}</h1>
            <div className="item">
              <div className="details">
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{user.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{user.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">DNI:</span>
                  <span className="itemValue">{user.dni}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Ocupation:</span>
                  <span className="itemValue">{user.ocupation}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Birthday:</span>
                  <span className="itemValue">{user.birthday}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
        <div className="reservationInfoSection"></div>
          <h2 className="sectionTitle">Información de la Reserva </h2>
          <div className="detailItem">
            <span className="itemKey">Nombre de la cabaña:</span>
            <span className="itemValue">{lodge.name}</span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Descripción de la cabaña:</span>
            <span className="itemValue">{lodge.description}</span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Fecha de Check-In:</span>
            <span className="itemValue">{new Date(booking.checkIn).toLocaleDateString()}</span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Fecha de Check-Out:</span>
            <span className="itemValue">{new Date(booking.checkOut).toLocaleDateString()}</span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Cantidad de Adultos:</span>
            <span className="itemValue">{(booking.numberOfAdults)}</span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Cantidad de niños:</span>
            <span className="itemValue">{(booking.numberOfChildren)}</span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Monto a pagar:</span>
            <span className="itemValue">{(booking.totalAmount)}</span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Monto de la seña:</span>
            <span className="itemValue">{((booking.totalAmount) * 0.3)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
