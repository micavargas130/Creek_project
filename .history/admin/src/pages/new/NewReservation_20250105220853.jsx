import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Calendar from "../../components/calendar/calendar.jsx";
import moment from 'moment';

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
  const [location, setLocation] = useState(null); 
  const [redirect, setRedirect] = useState(false);
  const [lodgesInfo, setLodgesInfo] = useState([]);
  const [price, setPrice] = useState([]);  //Precio del hospedaje
  const [amountDays, setAmountDays] = useState([]);
  const [lodgeId, setLodgeId] = useState("");
  const totalGuests = parseInt(numberOfAdults || 0) + parseInt(numberOfChildren || 0);


  // Estado para el modal de confirmación de pago
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pagada");


  //Traigo la data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const lodgesResponse = await axios.get("http://localhost:3000/lodges");
        setLodgesInfo(lodgesResponse.data);

        //Trae el precio de hospedar adulto y niño
        const priceResponse = await axios.get("http://localhost:3000/prices/66a82bc2ac1709160e479670");
        setPrice(priceResponse.data);
      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };

    fetchData();
  }, []);

  const calculateTotalPrice = (numberOfAdults, numberOfChildren, priceAdult, priceChild, days) => {
    return (numberOfAdults * priceAdult + numberOfChildren * priceChild) * days;
  };


  
  const handleDateSelect = (startStr, endStr) => {
    setCheckIn(startStr); // Actualizar checkIn
    setCheckOut(endStr); // Actualizar checkOut
  };

  const confirmFinishClick = async () => {
    try {

      console.log("aca");
    
    // Generar contraseña temporal
      const temporaryPassword = Math.random().toString(36).slice(-8);

      const userResponse = await axios.post("http://localhost:3000/register", {
        first_name,
        last_name,
        email,
        dni,
        birthday,
        phone,
        ocupation,
        password: "try"
      });

      console.log("aca11");  
   
      console.log("lodge", lodgeId);
      console.log("user", userResponse._id,);
      console.log("in", checkIn);
      console.log("out", checkOut);
      //console.log("totalAmount", priceToPay);

      console.log("aca2");
      const bookingResponse = await axios.post("http://localhost:3000/bookings/createBooking", {
        lodge: lodgeId,
        user: userResponse._id,
        checkIn,
        checkOut,
        numberOfAdults,
        numberOfChildren,
        totalAmount: 50000,
        status: '668ddcd66630f103dda28cdd'

      });

      console.log("aca3");
      console.log("bookingResponse", bookingResponse);

    


      alert("Registro exitoso");
      //setRedirect(true);
    } catch (err) {
      alert("Error al registrar la carpa");
    } finally {
      setModalVisible(false);
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
          <div className="left">
          <Calendar lodgeId={lodgeId} onDateSelect={handleDateSelect} />   {/* Actualizar el calendario basado en la cabaña seleccionada */}
          </div>
          <div className="right">
            <form onSubmit={confirmFinishClick}>
              <div className="mb-64">
                <div>
                  <div>
                    {/* Campo para seleccionar cabaña */}
                    <label htmlFor="lodge">Cabaña</label>
                    <select
                      id="lodge"
                      value={lodgeId}
                      onChange={(e) => setLodgeId(e.target.value)}
                      disabled={totalGuests === 0} // Deshabilitar si no se han ingresado huéspedes
                    >
                      <option value="" disabled>
                        {totalGuests === 0
                          ? "Primero ingresa el número de huéspedes"
                          : "Selecciona una cabaña"}
                      </option>
                      {lodgesInfo
                        .filter((lodge) => lodge.capacity >= totalGuests) // Filtrar por capacidad
                        .map((lodge) => (
                          <option key={lodge._id} value={lodge._id}>
                            {lodge.name} (Capacidad: {lodge.capacity})
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Resto del formulario */}

                  <div>
                <label>Check-In</label>
                <input type="date" value={checkIn} readOnly />
              </div>
              <div>
                <label>Check-Out</label>
                <input type="date" value={checkOut} readOnly />
              </div>


                  <div>
                    Nombre{" "}
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={first_name}
                      onChange={(ev) => setFirstName(ev.target.value)}
                    />
                    Apellido{" "}
                    <input
                      type="text"
                      placeholder="Apellido"
                      value={last_name}
                      onChange={(ev) => setLastName(ev.target.value)}
                    />
                    DNI
                    <input
                      type="number"
                      id="dni"
                      placeholder="Ingrese su DNI"
                      value={dni || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 8) {
                          setDni(value);
                        } else {
                          alert("El DNI no puede tener más de 8 números.");
                        }
                      }}
                    />
                     Cumpleaños
                    <input
                      placeholder={"cumpleaños"}
                      type="date" value={birthday}
                      onChange={(ev) => setBirthday(ev.target.value)}
                    />
                    Email
                    <input
                      type="email"
                      placeholder={"Email"}
                      value={email}
                      onChange={(ev) => setEmail(ev.target.value)}
                    />
                    Teléfono
                    <input
                      type="text"
                      placeholder="Teléfono"
                      value={phone}
                      onChange={(ev) => setPhone(ev.target.value)}
                    />
                    Ocupación
                    <input
                      type={"text"}
                      placeholder="Ocupación"
                      value={ocupation}
                      onChange={(ev) => setOcupation(ev.target.value)}
                    />
                  </div>
                  <div>
                    Cantidad de adultos
                    <input
                      type={"number"}
                      placeholder="Cantidad de adultos"
                      value={numberOfAdults}
                      onChange={(ev) => setNumberOfAdults(ev.target.value)}
                    />
                    Cantidad de niños
                    <input
                      type={"number"}
                      placeholder="Cantidad de niños"
                      value={numberOfChildren}
                      onChange={(ev) => setNumberOfChildren(ev.target.value)}
                    />
                  </div>
                </div>
              </div>
              <button type="submit">Registrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
