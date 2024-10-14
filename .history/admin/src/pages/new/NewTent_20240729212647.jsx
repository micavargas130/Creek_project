import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import FestivalRoundedIcon from '@mui/icons-material/FestivalRounded';
import HouseSidingRoundedIcon from '@mui/icons-material/HouseSidingRounded';
import PoolIcon from '@mui/icons-material/Pool';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GrillIcon from '@mui/icons-material/OutdoorGrillOutlined';
import GarageIcon from '@mui/icons-material/Garage';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
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
  const [priceAdult, setPriceAdult] = useState("");
  const [priceChild, setPriceChild] = useState("");
  const [location, setLocation] = useState(null); // Estado para la posición seleccionada

  const [redirect, setRedirect] = useState(false);
  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [lodgesInfo, setLodgesInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener las posiciones ocupadas actualmente
        const response = await axios.get("http://localhost:3000/tents/occupiedPositions");
        const { occupiedPositions } = response.data;
        setOccupiedPositions(occupiedPositions);

        // Obtener información de cabañas existentes (si es necesario)
        const lodgesResponse = await axios.get("http://localhost:3000/lodges");
        setLodgesInfo(lodgesResponse.data);

      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };

    fetchData();
  }, []);

  // Manejar clic en una celda del mapa
  const handleCellClick = (row, col, iconType) => {
    if (iconType === "FestivalRoundedIcon") {
      // Actualizar el estado con la posición seleccionada
      setLocation({ row, col });
    }
  };

  // Función para validar las fechas de check-in y check-out
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

  // Enviar el formulario para crear una nueva carpa ocupada
  const newTent = async (ev) => {
    ev.preventDefault();

    // Verificar si se ha seleccionado una posición
    if (!location) {
      alert("Debes seleccionar una posición en el mapa antes de enviar el formulario");
      return;
    }

    // Validar fechas
    const fechaError = validarFechas(checkIn, checkOut);
    if (fechaError) {
      alert(fechaError);
      return;
    }

    const { row, col } = location;

    try {
      // Enviar los datos al servidor
      await axios.post("http://localhost:3000/tents", {
        first_name,
        last_name,
        dni,
        email,
        phone,
        ocupation,
        checkIn,
        checkOut,
        priceAdult,
        priceChild,
        location: { row, col } // Incluir la ubicación seleccionada
      });

      // Mostrar mensaje de éxito y redireccionar
      alert("Registro exitoso");
      setRedirect(true);
    } catch (err) {
      alert("Error al registrar la carpa");
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
                      Cantidad de hospedados
                      <input
                        type={"number"}
                        placeholder="cant huespedes adultos"
                        value={priceAdult}
                        onChange={(ev) => setPriceAdult(ev.target.value)}
                      />
                    </div>
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
