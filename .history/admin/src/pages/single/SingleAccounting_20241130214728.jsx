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
  const [paymentHistory, setPaymentHistory] = useState([]);

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
          // Si es una cabaña, obtener los datos del usuario y la cabaña
          const bookingResponse = await axios.get(`/bookings/${entityId}`);
          const bookingData = bookingResponse.data;
          setEntity(bookingData);
          console.log("BookingResponse", entityId)

          // Verifica que entity.lodge esté definido antes de intentar acceder a sus propiedades
          if (bookingData.lodge && bookingData.lodge._id) {
            const lodgeResponse = await axios.get(`/lodges/${bookingData.lodge._id}`);
            setLodge(lodgeResponse.data);
            
          }

          const userResponse = await axios.get(`/user/${accountingData.user}`);
          setUser(userResponse.data);
        } else if (entityType === "tent") {
          console.log("Es una carpa");

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

  useEffect(() => {
    const fetchBookingData = async () => {
        try {
            const accountingResponse = await axios.get(`/accounting/${accountingId}`);
            const accountingData = accountingResponse.data;
            setAccounting(accountingData);

            const lodgeId = accountingData.lodge;

            if (lodgeId) {
                // Obtén el historial de pagos relacionado con la reserva
                const historyResponse = await axios.get(`/accounting/history/${lodgeId}`);
                setPaymentHistory(historyResponse.data);

                // Obtén los detalles de la cabaña o reserva
                const lodgeResponse = await axios.get(`/lodges/${lodgeId}`);
                setLodge(lodgeResponse.data);
            }

            
            const userResponse = await axios.get(`/user/${accountingData.user}`);
            setUser(userResponse.data);

    

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
          {entity.lodge && (
            <div className="detailItem">
              <span className="itemKey">Ubicación:</span>
              <span className="itemValue">{`${lodge.name}`}</span>
            </div>
          )}
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

<h1 className="title">Historial de Pagos</h1>
  {paymentHistory.length > 0 ? (
    <table className="paymentHistoryTable">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Monto</th>
          <th>Tipo</th>
          <th>Comentario</th>
        </tr>
      </thead>
      <tbody>
        {paymentHistory.map((payment) => (
          <tr key={payment._id}>
            <td>{new Date(payment.date).toLocaleDateString()}</td>
            <td>${payment.amount}</td>
            <td>{payment.type}</td>
            <td>{payment.comment || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No hay pagos registrados para esta reserva.</p>
  )}
        </div>
      </div>
    </div>
  );
};

export default Single;
