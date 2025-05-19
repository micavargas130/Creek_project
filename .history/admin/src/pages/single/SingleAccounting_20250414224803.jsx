import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance.js"


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
        const response = await axiosInstance.get(`/accounting/${accountingId}`);
        const accountingData = response.data;
        setAccounting(accountingData);
      
        // Determina si es una carpa o una cabaña
        const entityType = accountingData.lodge ? "lodge" : "tent";

        let entityId = null;
        if (entityType === "lodge" && accountingData.lodge?.lodge?._id) {
          entityId = accountingData.lodge.lodge._id;
        } else if (entityType === "tent" && accountingData.tent?._id) {
          entityId = accountingData.tent._id;
        } else {
          throw new Error("No se pudo determinar el entityId.");
        }
  
        if (entityType === "lodge") {
       
          // Si es una cabaña, obtener los datos del usuario y la cabaña
         const bookingResponse = await axiosInstance.get(`/bookings/${accountingData.lodge._id}`);
         const bookingData = bookingResponse.data;
          
         setEntity(bookingData); 

          //Historial de pagos para la Lodge
         const historyResponse = await axiosInstance.get(`/accounting/history/${accountingData.lodge._id}`);
         setPaymentHistory(historyResponse.data);

          // Verifica que entity.lodge esté definido antes de intentar acceder a sus propiedades
          if (bookingData.lodge && bookingData.lodge._id) {
            const lodgeResponse = await axiosInstance.get(`/lodges/${bookingData.lodge._id}`);
            setLodge(lodgeResponse.data); }
          
          //Seteo el usuario
          const userResponse = await axiosInstance.get(`/user/${accountingData.user._id}`);
          setUser(userResponse.data);

        } else if (entityType === "tent") {
          // Si es una carpa, obtener los datos directamente de la carpa
          const tentResponse = await axiosInstance.get(`/tents/${entityId}`);
          setEntity(tentResponse.data); 
          setUser(tentResponse.data);

          const historyResponse = await axiosInstance.get(`/accounting/history/${entityId}`);
          setPaymentHistory(historyResponse.data);      
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

  const totalPaid = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = entity.totalAmount - totalPaid;
  
  const handleCompletePayment = async () => {
    try {
      await axiosInstance.post(`/accounting/pay/${accountingId}`, {
        amount: remainingAmount,
        status: "pagada",
      });
      
      window.location.reload();
    } catch (error) {
      console.error("Error al completar el pago:", error);
    }
  };
  
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
              <span className="itemValue">{lodge.name}</span>
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

<div className="detailItem">
            <span className="itemKey">Cantidad de Adultos:</span>
            <span className="itemValue">{(entity.numberOfAdults)}</span>
          </div>
          <div className="detailItem">
            <span className="itemKey">Cantidad de niños:</span>
            <span className="itemValue">{(entity.numberOfChildren)}</span>
          </div>

          {entity.totalAmount && (
            <div className="detailItem">
            <span className="itemKey">Monto total a pagar:</span>
            <span className="itemValue">{entity.totalAmount}</span>
            </div>
           )}


          <h1 className="title">Historial de Pagos</h1>
          {
          paymentHistory.length > 0 ? (
            <div className="tableContainer">
              <table className="paymentHistoryTable">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment._id}>
                      <td>{new Date(payment.date).toLocaleDateString()}</td>
                      <td>${payment.amount}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="noPaymentsMessage">No hay pagos registrados para esta reserva.</p>
          )}
            {remainingAmount > 0 && (
            <button className="payButton" onClick={handleCompletePayment}>
              Completar Pago (${remainingAmount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Single;
