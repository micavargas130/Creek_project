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
  const [accounting, setAccounting] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { bookingId } = useParams();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        const bookingData = response.data;
        setBooking(bookingData);

        const userId = bookingData.user._id;
        const lodgeId = bookingData.lodge._id;

        const userResponse = await axiosInstance.get(`/user/${userId}`);
        setUser(userResponse.data);

        const lodgeResponse = await axiosInstance.get(`/lodges/${lodgeId}`);
        setLodge(lodgeResponse.data);

        const pricesResponse = await axiosInstance.get(`/prices/${accountingData.price}`);
                 console.log("prices", pricesResponse)
         setPrices(pricesResponse);

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
                  <span className="itemKey">Teléfono:</span>
                  <span className="itemValue">{user.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">DNI:</span>
                  <span className="itemValue">{user.dni}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Ocupación:</span>
                  <span className="itemValue">{user.ocupation}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Cumpleaños:</span>
                  <span className="itemValue">{user.birthday}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
         <div className="reservationInfoSection">
          <h2 className="sectionTitle">Información de la Reserva </h2>
          <div className="infoRow">
            <span className="label">Nombre de la cabaña:</span>
            <span className="value">{lodge.name}</span>
          </div>
          <div className="infoRow">
            <span className="label">Fecha de Check-In:</span>
            <span className="value">{booking.checkIn.slice(0, 10).split("-").reverse().join("/")}</span>
          </div>
          <div className="infoRow">
            <span className="label">Fecha de Check-Out:</span>
            <span className="value">{booking.checkOut.slice(0, 10).split("-").reverse().join("/")}</span>
          </div>
          <div className="infoRow">
            <span className="label">Cantidad de Adultos:</span>
            <span className="value">{(booking.numberOfAdults)}</span>
          </div>
          <div className="infoRow">
            <span className="label">Cantidad de niños:</span>
            <span className="value">{(booking.numberOfChildren)}</span>
          </div>
           <div className="infoRow">
                <span className="label">Tarifa por adulto:</span>
                <span className="value">${prices.data.priceAdult}</span>
              </div>
              <div className="infoRow">
                <span className="label">Tarifa por niño:</span>
                <span className="value">${prices.data.priceChild}</span>
              </div>
          <div className="infoRow totalAmount">
            <span className="label">Monto a pagar:</span>
            <span className="value">{(booking.totalAmount)}</span>
          </div>
          <div className="infoRow seña">
            <span className="label">Monto de la seña:</span>
            <span className="value">{((booking.totalAmount) * 0.3)}</span>
          </div>
        </div>
      </div>
     </div>
    </div>
  );
};

export default Single;
