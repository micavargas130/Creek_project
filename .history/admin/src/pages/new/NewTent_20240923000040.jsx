import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { Navigate } from "react-router-dom";
import MapComponent from "../../components/map/mapComponent.jsx";

const New = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ocupation, setOcupation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfAdults, setNumberOfAdults] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [location, setLocation] = useState(null); // Estado para la posición seleccionada

  const [redirect, setRedirect] = useState(false);
  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [lodgesInfo, setLodgesInfo] = useState([]);
  const [price, setPrice] = useState([]);

  const [currentParams, setCurrentParams] = useState(null);
  const [modalState, setModalState] = useState({
    visible: false,
    selectedStatus: "pagada",
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tents/occupiedPositions");
        const { occupiedPositions } = response.data;
        setOccupiedPositions(occupiedPositions);

        const lodgesResponse = await axios.get("http://localhost:3000/lodges");
        setLodgesInfo(lodgesResponse.data);

        const priceResponse = await axios.get("http://localhost:3000/prices/66a82bc2ac1709160e479670");
        setPrice(priceResponse.data);
      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };

    fetchData();
  }, []);

  const handleCellClick = (row, col, iconType) => {
    if (iconType === "FestivalRoundedIcon") {
      setLocation({ row, col });
    }
  };

  const validarFechas = (checkInStr, checkOutStr) => {
    const checkInDate = new Date(checkInStr);
    const checkOutDate = new Date(checkOutStr);
    const now = new Date();

    if (checkInDate <= now) {
      return "La fecha de check-in debe ser posterior a la fecha actual.";
    }
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

      const totalAmount = (numberOfAdults * price.priceAdult) + (numberOfChildren * price.priceChild);
      const tentId = tentResponse.data._id;

      const paymentData = {
        amount: totalAmount,
        type: "Ingreso",
        date: new Date().toISOString(),
        user: `${first_name} ${last_name}`,
        tent: tentId,
        comment: "Carpa",
        status: modalState.selectedStatus.toLowerCase(),
      };

      await axios.post("http://localhost:3000/accounting/createAccounting", paymentData);

      //alert("Registro exitoso");
     // setRedirect(true);
    } catch (err) {
      alert("Error al registrar la carpa");
    } finally {
      setModalState(true);
    }
  };

  if (redirect) {
    return <Navigate to={"/tents"} />;
  }

  return (

    
    <div className="new">
      {modalState.visible && (
        <div className="modal">
          <div className="modalContent">
            <h2>Seleccionar estado del pago</h2>
            <select value={modalState.selectedStatus} onChange={(e) => setModalState({ ...modalState, selectedStatus: e.target.value })}>
              <option value="pagada">Pagada</option>
              <option value="parcial">Parcial</option>
              <option value="pendiente">Pendiente</option>
            </select>
            <button onClick={() => setModalState({ ...modalState, visible: false })}>Confirmar</button>
            <button onClick={() => setModalState({ ...modalState, visible: false })}>Cancelar</button>
          </div>
        </div>
      )}

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
              <div className="mt-4 grow flex items-center justify-around">
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
                        onChange={(ev) => setCheckIn(ev.target.value)}
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
              </div>
              <button type="submit" >Registrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
