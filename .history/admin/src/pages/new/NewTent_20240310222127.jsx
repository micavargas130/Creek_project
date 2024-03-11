
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
  const [location, setLocation] = useState("");

  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [selectedCell, setSelectedCell] = useState([]);

  useEffect(() => {
    // Hacer la solicitud al servidor para obtener las cabañas y posiciones ocupadas
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tents/occupiedPositions");
        const { occupiedPositions } = response.data;

        setOccupiedPositions(occupiedPositions);
        // ... otras actualizaciones de estado ...
      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };
    fetchData();
  }, []);

  // Resto del código del componente...


  // Función para manejar el clic en una celda del mapa
  const handleCellClick = (row, col) => {
    const iconType = getIconType(row, col);

    
    if (iconType === "FestivalRoundedIcon") {
      const cellId = `${row}${col}`;
      setOccupiedPositions([...occupiedPositions, cellId]);
      
      // Desseleccionar la celda anterior (si hay alguna)
      if (selectedCell) {
        setSelectedCell(null);
      }

      setSelectedCell(cellId);
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

  // Función para obtener el id de la celda más reciente en el estado
  const getLastCellId = () => {
    if (occupiedPositions.length > 0) {
      return occupiedPositions[occupiedPositions.length - 1];
    }
    return null;
  };

  // Función para manejar el envío del formulario
  const newTent = async (ev) => {
    ev.preventDefault();

    const lastCellId = getLastCellId();
    if (lastCellId) {
      // Extraer la posición (row y col) del id
      const row = Number(lastCellId[0]);
      const col = Number(lastCellId[1]);

      // Enviar el formulario con el location actualizado
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
          location:  row * 10 + col,
        });

        alert("Registro exitoso");
        setRedirect(true);
      } catch (err) {
        alert("Email ya registrado");
      }
    } else {
      alert("Debes seleccionar una celda antes de enviar el formulario");
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
                  <div className="map">
  {Array.from({ length: 8 }, (_, row) => (
    <div key={row} className="map-row">
      {Array.from({ length: 10 }, (_, col) => {
        const isCellOccupied = occupiedPositions.some(
          (pos) => pos.row === row && pos.col === col
        );

        return (
          <div
            key={col}
            id={`${row}${col}`}
            className={`map-cell ${
              isCellOccupied ? "occupied" : ""
            } ${selectedCell.includes(`${row}${col}`) ? "selected" : ""}`}
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