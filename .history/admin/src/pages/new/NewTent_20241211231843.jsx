import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { Navigate } from "react-router-dom";
import MapComponent from "../../components/map/mapComponent.jsx";
import moment from 'moment';

const New = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ocupation, setOcupation] = useState("");
  const [checkIn, setCheckIn] = useState(moment().format('YYYY-MM-DD'));
  const [checkOut, setCheckOut] = useState("");
  const [numberOfAdults, setNumberOfAdults] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [location, setLocation] = useState(null); 
  const [redirect, setRedirect] = useState(false);
  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [lodgesInfo, setLodgesInfo] = useState([]);
  const [price, setPrice] = useState([]);  //Precio del hospedaje
  const [totalAmount, setTotalAmount] = useState(0); //Lo que debera pagar la persona
  const [partialPayment, setPartialPayment] = useState([]); //Lo que paga la persona
  const [daysDifference, setDaysDifference] = useState([]);


  // Estado para el modal de confirmación de pago
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pagada");


  //Traigo la data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tents/occupiedPositions");
        const { occupiedPositions } = response.data;
        setOccupiedPositions(occupiedPositions);

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

  //Click del mapa
  const handleCellClick = (row, col, iconType) => {
    if (iconType === "FestivalRoundedIcon") {
      setLocation({ row, col });
    }
  };


  //Validacion de fechas
  const validarFechas = (checkInStr, checkOutStr) => {
    const checkInDate = new Date(checkInStr);
    const checkOutDate = new Date(checkOutStr);
    const now = new Date();

    if (checkOutDate <= now) {
      return "La fecha de check-out debe ser posterior a la fecha actual.";
    }
    if (checkOutDate <= checkInDate) {
      return "La fecha de check-out debe ser posterior a la fecha de check-in.";
    }

    return null;
  };

  const newTent = async (ev) => {
    ev.preventDefault();

    if (!location) {
      alert("Debes seleccionar una posición en el mapa antes de enviar el formulario");
      return;
    }

    const fechaError = validarFechas(checkIn, checkOut);
    if (fechaError) {
      alert(fechaError);
      return;
    }

    // Abrir el modal para seleccionar el estado del pago
    setModalVisible(true);
  };


  const confirmFinishClick = async () => {
    const { row, col } = location;

    try {
      const tentResponse = await axios.post("http://localhost:3000/tents", {
        first_name,
        last_name,
        dni,
        email,
        phone,
        ocupation,
        checkIn,
        checkOut,
        numberOfAdults,
        numberOfChildren,
        location: { row, col },

      });

      const checkInDate = new Date(tentResponse.data.checkIn);
      const checkOutDate = new Date(tentResponse.data.checkOut);

     // Calculamos la diferencia en milisegundos
      const timeDifference = checkOutDate - checkInDate;

     // Convertimos la diferencia a días (1 día = 86400000 milisegundos)
      const daysDifference = Math.round(timeDifference / (1000 * 3600 * 24));
      setDaysDifference(daysDifference)

     console.log(tentResponse.data);
      const tentId = tentResponse.data._id;

     
      let payment = 0;

     // Determinar el valor de payment según el estado seleccionado
     if (selectedStatus === "pagada") {
       payment = ((tentResponse.data.price) * daysDifference); // Pago completo
       } else if (selectedStatus === "parcial") {
       payment = partialPayment; // Pago parcial ingresado por el usuario
       } else if (selectedStatus === "pendiente"){
       payment = 0; //el usuario no pago nada
       }

      const paymentData = {
        amount: payment, //lo que pago el cliente
        totalAmount: ((tentResponse.data.price)* daysDifference), //lo que debe pagar
        type: "Ingreso",
        date: new Date().toISOString(),
        tent: tentId,
        remainingAmount: (((tentResponse.data.price)* daysDifference) - partialPayment),
        status: selectedStatus.toLowerCase(), // Estado seleccionado (pagada, parcial, pendiente)
      };

      await axios.post("http://localhost:3000/accounting/createAccounting", paymentData);

      alert("Registro exitoso");
      setRedirect(true);
    } catch (err) {
      alert("Error al registrar la carpa");
    } finally {
      setModalVisible(false);
    }
  };

  if (redirect) {
    return <Navigate to={"/tents"} />;
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Añadir una nueva carpa ocupada</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <MapComponent onCellClick={handleCellClick} occupiedPositions={occupiedPositions} lodgesInfo={lodgesInfo} />
          </div>
          <div className="right">
            <form onSubmit={newTent}>
            <div className="mb-64">
                  <div>
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
                        type="text"
                        placeholder="Dni"
                        value={dni}
                        onChange={(ev) => setDni(ev.target.value)}
                      />
                      Email
                      <input
                        type="email"
                        placeholder={"Email"}
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                      />
                      Telefono
                      <input
                        type="text"
                        placeholder="Telefono"
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
                      Check-In
                      <input
                        type="date"
                        placeholder="check-in"
                        value={checkIn}
                        onChange={(ev) => setCheckIn(ev.target.value)} // Este onChange ya no será relevante
                        disabled
                       />
                      Check-Out
                      <input
                        type={"date"}
                        placeholder="check-out"
                        value={checkOut}
                        onChange={(ev) => setCheckOut(ev.target.value)}
                      />
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

      {modalVisible && (
  <div className="modal">
    <div className="modalContent">
      <h2>Seleccionar estado del pago</h2>
      <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
        <option value="pagada">Pagada</option>
        <option value="parcial">Parcial</option>
        <option value="pendiente">Pendiente</option>
      </select>
      <h2>Total a pagar: {((numberOfAdults * price.priceAdult) + (numberOfChildren * price.priceChild))* daysDifference} </h2>


      {/* Mostrar campo de entrada solo si el estado es "parcial" */}
      {selectedStatus === "parcial" && (
        <div>
          <label htmlFor="partialPayment">Monto entregado:</label>
          <input
            type="number"
            id="partialPayment"
            placeholder="Ingrese monto parcial"
            value={partialPayment || ""}
            onChange={(e) => setPartialPayment(Number(e.target.value))}
          />
        </div>
      )}

      <button onClick={confirmFinishClick}>Confirmar</button>
      <button onClick={() => setModalVisible(false)}>Cancelar</button>
    </div>
  </div>
)}
    </div>
  );
};

export default New;
