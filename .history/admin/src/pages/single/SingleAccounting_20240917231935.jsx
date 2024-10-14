import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Single = () => {
  const [accounting, setAccounting] = useState({});
  const [user, setUser] = useState({});
  const [entity, setEntity] = useState({});
  const [lodge, setLodge] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtengo ID del ingreso de la URL
  const { accountingId } = useParams();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        // Realiza una solicitud al servidor para obtener la información de la reserva
        const response = await axios.get(`/accounting/${accountingId}`);
        const accountingData = response.data;
        setAccounting(accountingData);

        
        // Determina si es una carpa o una cabaña
        const entityType = accountingData.lodge ? "lodge" : "tent";
        const entityId = accountingData.lodge || accountingData.tent;

        if (entityType === "lodge") {
          console.log("esta aca")
          // Si es una cabaña, obtener los datos del usuario y la cabaña
          const bookingResponse = await axios.get(`/bookings/${entityId}`);
          setEntity(bookingResponse.data);
      
          const lodgeResponse = await axios.get(`/lodges/${entity.lodge._id}`);
          setLodge(lodgeResponse);

          const userResponse = await axios.get(`/user/${accountingData.user}`);
          console.log(userResponse)
          setUser(userResponse.data);
        } else if (entityType === "tent") {
          console.log("esta aca1")
          // Si es una carpa, obtener los datos directamente de la carpa
          const tentResponse = await axios.get(`/tents/${entityId}`);
          setEntity(tentResponse.data);
          setUser(tentResponse.data); // Aquí los datos del usuario están en el modelo de la carpa
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [accountingId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <h1 className="title">Información del huésped</h1>
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
              
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Información de la {accounting.lodge ? "cabaña" : "carpa"}</h1>
          <div className="detailItem">
            <span className="itemKey">Ubicación:</span>
            <span className="itemValue">{`${lodge.name}`}</span>
          </div>
          {entity.checkIn && (
            <div className="detailItem">
              <span className="itemKey">Fecha de Check-In:</span>
              <span className="itemValue">{new Date(entity.checkIn).toLocaleDateString()}</span>
            </div>
          )}
          {entity.checkOut && (
            <div className="detailItem">
              <span className="itemKey">Fecha de Check-Out:</span>
              <span className="itemValue">{new Date(entity.checkOut).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Single;
