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
        const entityType = accountingData.cabain ? "lodge" : "tent";
        const entityId = accountingData.cabain || accountingData.tent;

        if (entityType === "cabin") {
          // Si es una cabaña, obtener los datos del usuario y la cabaña
          const lodgeResponse = await axios.get(`/lodges/${entityId}`);
          setEntity(lodgeResponse.data);

          const userResponse = await axios.get(`/users/${lodgeResponse.data.occupiedBy}`);
          setUser(userResponse.data);
        } else if (entityType === "tent") {
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
            <div className="editButton">Edit</div>
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
                <div className="detailItem">
                  <span className="itemKey">Ocupación:</span>
                  <span className="itemValue">{user.occupation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Información de la {accounting.cabain ? "cabaña" : "carpa"}</h1>
          <div className="detailItem">
            <span className="itemKey">Ubicación:</span>
            <span className="itemValue">{`${entity.location?.row}, ${entity.location?.col}`}</span>
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
