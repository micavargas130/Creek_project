import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axiosInstance from "../../axios/axiosInstance.js"
import { Navigate } from "react-router-dom";
import Calendar from "../../components/calendar/calendar.jsx";
import moment from 'moment';
import "./newReservation.scss";

const New = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [ocupation, setOcupation] = useState("");
  const [checkIn, setCheckIn] = useState(moment().format('YYYY-MM-DD'));
  const [checkOut, setCheckOut] = useState("");
  const [numberOfAdults, setNumberOfAdults] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [lodgeId, setLodgeId] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [lodgesInfo, setLodgesInfo] = useState([]);
  const [price, setPrice] = useState([]);  
  const [totalPrice, setTotalPrice] = useState(0);  // 🔹 Estado para el total a pagar

  const totalGuests = parseInt(numberOfAdults || 0) + parseInt(numberOfChildren || 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lodgesResponse = await axiosInstance.get("http://localhost:3000/lodges");
        setLodgesInfo(lodgesResponse.data);
  
        const priceResponse = await axiosInstance.get("http://localhost:3000/prices/last/cabanas");
        setPrice(priceResponse.data);
      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };
    fetchData();
  }, []);

  const calculateTotalPrice = (numberOfAdults, numberOfChildren, priceAdult, priceChild, days) => {
    return (((numberOfAdults * priceAdult) + (numberOfChildren * priceChild)) * days);
  };

  const handleDateSelect = (startStr, endStr) => {
    setCheckIn(startStr);
    setCheckOut(endStr);
  };

  // 🔹 Recalcular el precio cada vez que cambian fechas o huéspedes
  useEffect(() => {
    if (checkIn && checkOut && numberOfAdults >= 0 && numberOfChildren >= 0) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const timeDifference = checkOutDate - checkInDate;
      const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

      const total = calculateTotalPrice(numberOfAdults, numberOfChildren, price.priceAdult || 0, price.priceChild || 0, daysDifference);
      setTotalPrice(total);
    }
  }, [checkIn, checkOut, numberOfAdults, numberOfChildren, price]);

  const confirmFinishClick = async (event) => {
    event.preventDefault();
    try {
      console.log("Comenzando registro...");
  
      const temporaryPassword = Math.random().toString(36).slice(-8);
  
      const userResponse = await axiosInstance.post("http://localhost:3000/register", {
        first_name, last_name, email, dni, birthday, phone, ocupation, password: temporaryPassword,
      });
  
      await axiosInstance.post("http://localhost:3000/bookings/createBooking", {
        lodge: lodgeId,
        user: userResponse.data._id,
        checkIn, checkOut,
        numberOfAdults, numberOfChildren,
        totalAmount: totalPrice,  
        status: "668ddcd66630f103dda28cdd",
        lodgeName: lodgesInfo.find(lodge => lodge._id === lodgeId)?.name || "N/A",
        password: temporaryPassword,
        sendEmail: true,
      });
  
      alert(`Registro exitoso. Total a pagar: $${totalPrice}. Se ha enviado un correo de confirmación.`);
      setRedirect(true);
    } catch (err) {
      console.error("Error en la reserva:", err);
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={"/bookings"} />;
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Crear nueva Reserva</h1>
        </div>
        <div className="bottom">
          <div className="calendar-container">
            <Calendar lodgeId={lodgeId} onDateSelect={handleDateSelect} />
          </div>
          <div className="right">
            <form onSubmit={confirmFinishClick}>
              <div className="mb-64">
                <div>
                  <label htmlFor="lodge">Cabaña</label>
                  <select
                    id="lodge"
                    value={lodgeId}
                    onChange={(e) => setLodgeId(e.target.value)}
                    disabled={totalGuests === 0}
                  >
                    <option value="" disabled>
                      {totalGuests === 0 ? "Primero ingresa el número de huéspedes" : "Selecciona una cabaña"}
                    </option>
                    {lodgesInfo
                      .filter((lodge) => lodge.capacity >= totalGuests)
                      .map((lodge) => (
                        <option key={lodge._id} value={lodge._id}>
                          {lodge.name} (Capacidad: {lodge.capacity})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label>Cantidad de adultos</label>
                  <input type="number" value={numberOfAdults} onChange={(ev) => setNumberOfAdults(ev.target.value)} />
                  <label>Cantidad de niños</label>
                  <input type="number" value={numberOfChildren} onChange={(ev) => setNumberOfChildren(ev.target.value)} />
                </div>

                <div>
                  <label>Check-In</label>
                  <input type="date" value={checkIn} readOnly />
                </div>
                <div>
                  <label>Check-Out</label>
                  <input type="date" value={checkOut} readOnly />
                </div>

                <div>
                  <label>Nombre</label>
                  <input type="text" value={first_name} onChange={(ev) => setFirstName(ev.target.value)} />
                  <label>Apellido</label>
                  <input type="text" value={last_name} onChange={(ev) => setLastName(ev.target.value)} />
                  <label>DNI</label>
                  <input type="number" value={dni} onChange={(e) => setDni(e.target.value)} />
                  <label>Teléfono</label>
                  <input type="text" value={phone} onChange={(ev) => setPhone(ev.target.value)} />
                </div>
                 <label>Cumpleaños</label> <input placeholder={"cumpleaños"} type="date" value={birthday} onChange={(ev) => setBirthday(ev.target.value)}/>
                    <label>Email</label>
                    <input  type="email"  placeholder={"Email"}  value={email}  onChange={(ev) => setEmail(ev.target.value)}/>
                    <label>Ocupación</label>
                    <input type={"text"} placeholder="Ocupación" value={ocupation} onChange={(ev) => setOcupation(ev.target.value)} />
              </div>

              {/* 🔹 Mostrar el total a pagar */}
              <h3>Total a pagar: ${totalPrice}</h3>

              <button type="submit">Registrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
