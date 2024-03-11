
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import FestivalRoundedIcon from '@mui/icons-material/FestivalRounded';
import HouseSidingRoundedIcon from '@mui/icons-material/HouseSidingRounded';
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

  const [occupiedPositions, setOccupiedPositions] = useState([]);

  // Función para manejar el clic en una celda del mapa
  const handleCellClick = (row, col) => {
    // Si la posición ya está ocupada, no hacer nada
    if (occupiedPositions.some(pos => pos.row === row && pos.col === col)) {
      return;
    }

    // Agregar la posición a las ocupadas
    setOccupiedPositions([...occupiedPositions, { row, col }]);
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
             
                    <h1>Datos del huesped</h1>
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
                    <h1>Datos de la reserva</h1>
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
                              className={`map-cell ${
                                occupiedPositions.some(
                                  (pos) => pos.row === row && pos.col === col
                                )
                                  ? "occupied"
                                  : ""
                              }`}
                              onClick={() => handleCellClick(row, col)}
                            >
                              {/* Mostrar diferentes iconos según la posición de la celda */}
                              {row >= 0 && row <= 2 && col <= 3  ? (
                                <HouseSidingRoundedIcon className="icon" />
                              ) : (
                                <FestivalRoundedIcon className="icon" />
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