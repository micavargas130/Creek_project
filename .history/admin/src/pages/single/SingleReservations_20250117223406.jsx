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

  // Obtén el ID de la reserva de la URL
  const { bookingId } = useParams();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        // Realiza una solicitud al servidor para obtener la información de la reserva
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        const bookingData = response.data;
        setBooking(bookingData);

        // Una vez que tengas la información de la reserva, puedes acceder al ID del usuario y al ID de la cabaña
        const userId = bookingData.user._id;
        const lodgeId = bookingData.lodge._id;

        // Realiza una solicitud al servidor para obtener la información del usuario
        const userResponse = await axiosInstance.get(`/user/${userId}`);
        setUser(userResponse.data);

        // Realiza una solicitud al servidor para obtener la información de la cabaña
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
            <h1 className="title">Información del huesped</h1>
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
          <h1 className="title">Información de la cabaña</h1>
          <div className="detailItem">
            <span className="itemKey">Nombre:</span>
            <span className="itemValue">{lodge.name}</span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Descripción:</span>
            <span className="itemValue">{lodge.description}</span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Ubicación:</span>
            <span className="itemValue">{`${lodge.location.row}, ${lodge.location.col}`}</span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Fecha de Check-In:</span>
            <span className="itemValue">{new Date(booking.checkIn).toLocaleDateString()}</span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Fecha de Check-Out:</span>
            <span className="itemValue">{new Date(booking.checkOut).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
