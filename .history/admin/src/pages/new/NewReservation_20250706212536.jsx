import  { useState, useEffect } from "react";
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
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfAdults, setNumberOfAdults] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [lodgeId, setLodgeId] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [lodgesInfo, setLodgesInfo] = useState([]);
  const [price, setPrice] = useState([]);  
  const [totalPrice, setTotalPrice] = useState(0);
  const [userExists, setUserExists] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);
  const totalGuests = parseInt(numberOfAdults || 0) + parseInt(numberOfChildren || 0);
  const [hasChosenLodge, setHasChosenLodge] = useState(false);

useEffect(() => {
  const fetchLodges = async () => {
    try {
      let res;
      if (checkIn && checkOut) {
        const res = await axiosInstance.get(`/lodges/available?checkIn=${checkIn}&checkOut=${checkOut}`);
        setLodgesInfo(res.data);      

      } else {
        setLodgesInfo([]); // No mostrar ninguna cabaña si faltan fechas
      }
      setLodgesInfo(res.data);

      const priceResponse = await axiosInstance.get("/prices/last/cabañas");
      setPrice(priceResponse.data);

      // 🔍 Verificamos si el lodge seleccionado todavía está disponible
      const stillAvailable = res.data.find((l) => l._id === lodgeId);
      if (!stillAvailable) {
        setLodgeId(""); // lo deselecciona si ya no está
        setHasChosenLodge(false);
      }

      if (hasChosenLodge && res.data.length > 0) {
        const stillValid = res.data.find(l => l._id === lodgeId);
        if (!stillValid) {
          setLodgeId(res.data[0]._id);
        }
      }
    } catch (error) {
      console.error("Error al obtener cabañas:", error);
    }
  };

  fetchLodges();
}, [checkIn, checkOut]);


  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (email) {
        try {
          const res = await axiosInstance.get(`/user/byEmail/${email}`);
          if (res.data) {
            setFirstName(res.data.first_name);
            setLastName(res.data.last_name);
            setPhone(res.data.phone);
            setDni(res.data.dni);
            setBirthday(res.data.birthday?.slice(0, 10)); 
            setOcupation(res.data.ocupation);
          }
        } catch (error) {
          console.log("Usuario no encontrado, campos habilitados para ingresar");
        }
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [email]);

  const calculateTotalPrice = (numberOfAdults, numberOfChildren, priceAdult, priceChild, days) => {
    return (((numberOfAdults * priceAdult) + (numberOfChildren * priceChild)) * days);
  };

  const handleDateSelect = (startStr, endStr) => {
    setCheckIn(startStr);
    setCheckOut(endStr);
  };

  //Recalcular el precio cada vez que cambian fechas o huéspedes
  useEffect(() => {
  if (checkIn && checkOut && numberOfAdults >= 0 && numberOfChildren >= 0) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDifference = checkOutDate - checkInDate;
    let daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    if (daysDifference < 1) daysDifference = 1;  //minimo un dia por si la fecha de checkIn y checkOut es la misma

    const total = calculateTotalPrice( numberOfAdults, numberOfChildren, price.priceAdult || 0, price.priceChild || 0, daysDifference);
    console.log("total", price)
    setTotalPrice(total);
  }
}, [checkIn, checkOut, numberOfAdults, numberOfChildren, price]);

  const confirmFinishClick = async (event) => {
    event.preventDefault();
    try {
      console.log("Comenzando registro...");
  
      const temporaryPassword = Math.random().toString(36).slice(-8);
      let userId = null;
      let sendEmailFlag = true;
  
      //verificar si el usuario ya existe
      const existingUser = await axiosInstance.get(`/user/byEmail/${email}`);
      if (existingUser.data) {
        userId = existingUser.data._id;
        sendEmailFlag = false; // No enviar correo si el usuario ya está registrado
        console.log("usuario ya registrado")
      } else {
        //si no existe, crearlo
        const userResponse = await axiosInstance.post("/register", {
          first_name, last_name, email, dni, birthday, phone, ocupation, password: temporaryPassword,
        });
        userId = userResponse.data._id;
      }

      //crear la reserva
      await axiosInstance.post("/bookings/createBooking", {
        lodge: lodgeId,
        user: userId,
        checkIn, checkOut,
        numberOfAdults, numberOfChildren,
        totalAmount: totalPrice,
        lodgeName: lodgesInfo.find(lodge => lodge._id === lodgeId)?.name || "N/A",
        password: temporaryPassword,
        sendEmail: sendEmailFlag,
        origin: "manual"
      });

      console.log("usuario no registrado")
      alert(`Reserva registrada con éxito. Total a pagar: $${totalPrice}.`);
      setRedirect(true);
    } catch (err) {
      console.error("Error en la reserva:", err);
      setRedirect(true);
    }
  };
  
  if (redirect) { return <Navigate to={"/bookings"} />; }

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
           <Calendar 
             lodgeId={lodgeId} 
             onDateSelect={handleDateSelect} 
             checkIn={checkIn} 
             checkOut={checkOut}
           />      
          </div>
          <div className="right">
            <form onSubmit={confirmFinishClick}>
              <div className="mb-64">
                <div>
                  <label htmlFor="lodge">Cabaña</label>
                  <select
                    id="lodge"
                    value={lodgeId}
                    onChange={(e) => {setLodgeId(e.target.value);
                                     setHasChosenLodge(true);}
                    }
                    disabled={totalGuests === 0} 
                  >
                    <option value=" " disabled>
                      {(totalGuests === 0 && !checkIn) ? "Primero ingresa el número de huéspedes y fechas" : "Selecciona una cabaña"}
                    </option>
                    {lodgesInfo.filter((lodge) => lodge.capacity >= totalGuests).map((lodge) => (
                        <option key={lodge._id} value={lodge._id}>
                          {lodge.name} (Capacidad: {lodge.capacity})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label>Cantidad de adultos</label> <input type="number"  min="0" value={numberOfAdults} onChange={(ev) => setNumberOfAdults(ev.target.value)} />
                  <label>Cantidad de niños</label> <input type="number"   min="0" value={numberOfChildren} onChange={(ev) => setNumberOfChildren(Number(ev.target.value) || 0)} />
                </div>
                <div>
                 <label>Check-In</label>
                  <input type="date" value={checkIn} min={moment().format("DD-MM-YYYY")} 
                    onChange={(e) => {
                      const selected = e.target.value;
                      const today = moment().format("DD-MM-YYYY");
                      if (selected < today) {
                        alert("No puedes seleccionar una fecha pasada");
                        return;
                      }
                      setCheckIn(selected);
                    }}
                  />
                </div>
                <div>
                  <label>Check-Out</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || moment().format("DD-MM-YYYY")}
                    onChange={(e) => {
                      const selected = e.target.value;
                      const today = moment().format("DD-MM-YYYY");
                      if (selected < today) {
        alert("No puedes seleccionar una fecha pasada");
        return;
                      }
                      if (checkIn && selected < checkIn) {
        alert("La fecha de salida no puede ser anterior a la de entrada");
        return;
                      }
                      setCheckOut(selected);
                    }}
                  />
                </div>

                <div>
                  <label>Email</label> <input type="email" placeholder="Email" value={email} onChange={(ev) => {
                      setEmail(ev.target.value);
                      setUserExists(false); // Resetear si cambia el email
                    }}
                    onBlur={async () => {
                      if (!email) return;
                      setCheckingUser(true);
                      try {
                        const res = await axiosInstance.get(`/user/byEmail/${email}`);
                        if (res.data) {
                          setFirstName(res.data.first_name);
                          setLastName(res.data.last_name);
                          setPhone(res.data.phone);
                          setDni(res.data.dni);
                          setBirthday(res.data.birthday?.slice(0, 10));
                          setOcupation(res.data.ocupation);
                          setUserExists(true);
                        } else {
                          setUserExists(false);
                        }
                      } catch (err) {
                        console.error("Error al verificar usuario:", err);
                      } finally {
                        setCheckingUser(false);
                      }
                    }}
                  />
                  {checkingUser && <small>Verificando correo...</small>}
                  {userExists && <small style={{ color: "green" }}>Este usuario ya está registrado. Se usarán sus datos.</small>}

                <div>
                <label>Teléfono</label>
                <input type="text" value={phone} onChange={(ev) => setPhone(ev.target.value)}  />
                 <label>Nombre</label>
                 <input type="text" value={first_name} onChange={(ev) => setFirstName(ev.target.value)} disabled={userExists} />
                 <label>Apellido</label>
                 <input type="text" value={last_name} onChange={(ev) => setLastName(ev.target.value)} disabled={userExists} />                 
                 <label>DNI</label>
                 <input type="number" value={dni} onChange={(e) => setDni(e.target.value)} disabled={userExists} />
                 <label>Cumpleaños</label>
                 <input type="date" value={birthday} onChange={(ev) => setBirthday(ev.target.value)} disabled={userExists} />
                 <label>Ocupación</label>
                 <input type="text" value={ocupation} onChange={(ev) => setOcupation(ev.target.value)} disabled={userExists} />
                 </div>
                </div>
              </div>
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
