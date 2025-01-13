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
        
        console.log("entit2y", accountingData)
        // Determina si es una carpa o una cabaña
        const entityType = accountingData.lodge ? "lodge" : "tent";
        console.log(entityType);

        let entityId = null;
        if (entityType === "lodge" && accountingData.lodge?.lodge?._id) {
          entityId = accountingData.lodge.lodge._id;
        } else if (entityType === "tent" && accountingData.tent?._id) {
          entityId = accountingData.tent._id;
        } else {
          throw new Error("No se pudo determinar el entityId.");
        }
  
        if (entityType === "lodge") {
          console.log("es Cabaña")
          console.log("IdBooking", accountingData.lodge._id)
       
          // Si es una cabaña, obtener los datos del usuario y la cabaña
         const bookingResponse = await axios.get(`/bookings/${accountingData.lodge._id}`);
         const bookingData = bookingResponse.data;

         console.log("ay",bookingResponse.data);
          setEntity(bookingData); 


          //Historial de pagos para la Lodge
          const historyResponse = await axios.get(`/accounting/history/${accountingData.lodge._id}`);
          setPaymentHistory(historyResponse.data);
         console.log("bookingData",bookingResponse)

          // Verifica que entity.lodge esté definido antes de intentar acceder a sus propiedades
          if (bookingData.lodge && bookingData.lodge._id) {
            const lodgeResponse = await axios.get(`/lodges/${bookingData.lodge._id}`);
            setLodge(lodgeResponse.data); 
            
            
          }
          

          //Seteo el usuario
          const userResponse = await axios.get(`/user/${accountingData.user._id}`);
          setUser(userResponse.data);

        } else if (entityType === "tent") {
          console.log("Es una carpa");

          // Si es una carpa, obtener los datos directamente de la carpa
          const tentResponse = await axios.get(`/tents/${entityId}`);
          setUser(tentResponse.data);

          console.log("id carpa", entityId);

          const historyResponse = await axios.get(`/accounting/history/${entityId}`);
          //console.log("history", historyResponse);
          setPaymentHistory(historyResponse.data);
          console.log("jfke",paymentHistory)
      
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
          {entity.lodge && (
            <div className="detailItem">
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

          {entity.lodge && (
            <div className="detailItem">
              
            <span className="itemValue">{`${entity.totalAmount}`}</span>
            </div>
           )}


       


<h1 className="title">Historial de Pagos</h1>
{paymentHistory.length > 0 ? (
  <div className="tableContainer">
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
  </div>
) : (
  <p className="noPaymentsMessage">No hay pagos registrados para esta reserva.</p>
)}
        </div>
      </div>
    </div>
  );
};

export default Single;
