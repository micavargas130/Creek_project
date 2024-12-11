import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const Single = () => {

  const [user, setUser] = useState([]);
  const [booking, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notificationCreated, setNotificationCreated] = useState(false);
  const [userInLodge, setUserInLodge] = useState('');

  // Obtén el ID del usuario de la URL
  const { lodgeId } = useParams();


  useEffect(() => {
    axios.get(`/lodges/${lodgeId}`)
      .then((response) => {
        const lodge = response.data;
        const bookingId = lodge.occupiedBy;
  
        // Realiza una solicitud al servidor para obtener la información de la reserva
        axios.get(`/bookings/${bookingId}`)
          .then((bookingResponse) => {
            const booking = bookingResponse.data;
            console.log(booking.user._id)
  
            // Realiza una solicitud al servidor para obtener la información del usuario
            axios.get(`/user/${booking.user._id}`)
              .then((userResponse) => {
                const user = userResponse.data;
  
                // Una vez que tengas todos los datos, puedes actualizar los estados
                setBooking(booking);
                setUser(user);
                setLoading(false);

                // Calcula la fecha actual
                const currentDate = new Date();

               // Calcula la fecha de check-out
                const checkOutDate = new Date(booking.checkOut);

        // Compara las fechas para determinar si es el día de check-out
               if (currentDate >= checkOutDate && !notificationCreated) {
          // Si es el día de check-out, crea la notificación
               axios.post("/notifications", {
                 type: "Fin de estadia",
                 cabain: lodgeId, // Cambia "cabain" por "cabin" si es un error tipográfico
                 client: booking.user,
                 date: checkOutDate,
                
          });

             setNotificationCreated(true);
        }
  
                // Ahora, aquí tienes acceso a los datos actualizados de usuario y reserva
                console.log("User data:", user);
                console.log("Booking data:", booking);
              })
              .catch((userError) => {
                setError(userError);
                setLoading(false);
              });
          })
          .catch((bookingError) => {
            setError(bookingError);
            setLoading(false);
          });
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [lodgeId]);

  
  
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
          <div className="editButton">Edit</div>
            <h1 className="title">Información del huesped</h1>
           
              <h1 className="item">
                {user.first_name} {user.last_name}
              </h1>
              <div className="item">
              <div className="details">
              <h2 className="detailItem">DNI: {user.dni} </h2>
              <h2 className="detailItem">Ocupación: {user.ocupation} </h2>
              <h1 className="detailItem">Contacto: </h1>
              <h2 className="detailItem">Email: {user.email} </h2>
              <h2 className="detailItem">Telefono: {user.phone} </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Información de la reserva</h1>
          <h1 className="detailItem">CheckIn:{booking.checkIn}</h1>
          <h1 className="detailItem">CheckOut:{booking.checkOut}</h1>
          <h1 className="detailItem">Cantidad de huespedes:{(booking.numberOfChildren + booking.numberOfAdults}</h1>
          <h1 className="detailItem">Cantidad a pagar:{booking.totalAmount}</h1>
        </div>
      </div>
    </div>
  );
};
export default Single;
