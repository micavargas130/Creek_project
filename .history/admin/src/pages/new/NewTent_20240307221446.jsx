
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import FestivalRoundedIcon from '@mui/icons-material/FestivalRounded';
import HouseSidingRoundedIcon from '@mui/icons-material/HouseSidingRounded';
import PoolIcon from '@mui/icons-material/Pool';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GrillIcon from '@mui/icons-material/OutdoorGrillOutlined';
import GarageIcon from '@mui/icons-material/Garage';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import { Link, Navigate } from "react-router-dom";

const New = ({ inputs, title }) => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ocupation, setOcupation] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [occupiedPositions, setOccupiedPositions] = useState([]);

  // Función para manejar el clic en una celda del mapa
  const handleCellClick = (row, col) => {
  // Obtener el tipo de icono en la celda actual
  const iconType = getIconType(row, col);
  if (iconType === "FestivalRoundedIcon") {
    // Obtener el id de la celda
    const cellId = `${row}${col}`;


  // Permitir la selección solo si el tipo de icono es FestivalRoundedIcon

    setOccupiedPositions([...occupiedPositions, { row, col }]);

    console.log(`Clicked on cell with id ${cellId}`);

  }
};

// Función para obtener el tipo de icono en una posición específica
const getIconType = (row, col) => {
  if (row >= 2 && col >= 0 && col < 2) {
    return "HouseSidingRoundedIcon";
  } else if (row === 5 && col === 2) {
    return "OtherHousesIcon";
  } else if (row >= 6 && col >= 2 && col < 4) {
    return "PoolIcon";
  } else if (row >= 5 && col >= 3 && col < 4) {
    return "RestaurantIcon";
  } else if (row >= 3 && col >= 8) {
    return "GarageIcon";
  } else if (row >= 3 && row <= 4 && col >= 2 && col <= 4) {
    return "GrillIcon";
  } else {
    return "FestivalRoundedIcon";
  }
};


  async function newTent(ev) {
    ev.preventDefault();

    try {
      await axios.post("http://localhost:3000/tents", {
        first_name,
        last_name,
        dni,
        email,
        phone,
        ocupation,
        checkIn,
        checkOut,
        numberOfGuests,
        location,
      });

      alert("Registro exitoso");
      setRedirect(true);
    } catch (err) {
      alert("Email ya registrado");
    }
  }

  if (redirect) {
    return <Navigate to={"/tents"} />;
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Añadir una nueva cabaña</h1>
        </div>
        <div className="bottom">
          <div className="left">
          </div>
          <div className="right">
            <form onSubmit={newTent}>
              <div className="mt-4 grow flex items-center justify-around">
                <div className="mb-64"><div>
             
                   
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
                      placeholder="cant huespedes"
                      value={numberOfGuests}
                      onChange={(ev) => setNumberOfGuests(ev.target.value)}
                    />
                  </div>
                  <div id="map" style={{ height: "4px" }}></div>
                   <div className="map-container">
                    {/* Crear la cuadrícula */}
                    <div className="map">
                      {Array.from({ length: 8 }, (_, row) => (
                        <div key={row} className="map-row">
                          {Array.from({ length: 10 }, (_, col) => (
                            <div
                              key={col}
                              id={`${row}${col}`}
                              className={`map-cell ${
                                occupiedPositions.some(
                                  (pos) => pos.row === row && pos.col === col
                                )
                                  ? "occupied"
                                  : ""
                              }`}
                              onClick={() => handleCellClick(row, col)}
                            >
                                {getIconType(row, col) === "HouseSidingRoundedIcon" && (                                  
                                 <HouseSidingRoundedIcon className="house-cell" />
                                  )}
                                  {getIconType(row, col) === "FestivalRoundedIcon" && (
                                    <FestivalRoundedIcon className="icon" />
                                  )}
                                  {getIconType(row, col) === "OtherHousesIcon" && (
                                   <OtherHousesIcon className="mainhouse-cell" />
                                  )}
                                  {getIconType(row, col) === "PoolIcon" && (
                                   <PoolIcon className="pool-cell" />
                                 )}
                                 {getIconType(row, col) === "RestaurantIcon" && (
                                   <RestaurantIcon className="restaurant-cell" />
                                 )}
                                 {getIconType(row, col) === "GarageIcon" && (
                                   <GarageIcon className="garage-cell" />
                                 )}
                                 {getIconType(row, col) === "GrillIcon" && (
                                   <GrillIcon className="grill-cell" />
                                 )}
                          
                             
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center py-2 text-gray-500"></div>
                </div>
              </div>
              <button>Send</button>
            </form>
 
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;