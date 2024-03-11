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
import { Navigate } from "react-router-dom";

const New = () => {
  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    dni: "",
    email: "",
    phone: "",
    ocupation: "",
    checkIn: "",
    checkOut: "",
    numberOfGuests: "",
  });

  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tents/occupiedPositions");
        const { occupiedPositions } = response.data;

        setOccupiedPositions(occupiedPositions);
      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };

    fetchData();
  }, []);

  const handleCellClick = (row, col) => {
    const iconType = getIconType(row, col);

    if (iconType === "FestivalRoundedIcon") {
      const cellId = `${row}${col}`;
      setOccupiedPositions([...occupiedPositions, cellId]);

      setSelectedCell(cellId);
      console.log(`Clicked on cell with id ${cellId}`);
    }
  };

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

  const getLastCellId = () => {
    if (occupiedPositions.length > 0) {
      return occupiedPositions[occupiedPositions.length - 1];
    }
    return null;
  };

  const newTent = async (ev) => {
    ev.preventDefault();

    const lastCellId = getLastCellId();
    if (lastCellId) {
      const row = Number(lastCellId[0]);
      const col = Number(lastCellId[1]);

      try {
        await axios.post("http://localhost:3000/tents", {
          ...formValues,
          location: row * 10 + col,
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
                <div className="mb-64">
                  {/* Resto de tu formulario */}
                  {/* ... */}
                  <div id="map" style={{ height: "4px" }}></div>
                  <div className="map-container">
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
                                } ${selectedCell === `${row}${col}` ? "selected" : ""}`}
                                onClick={() => handleCellClick(row, col)}
                              >
                                {/* Contenido de la celda según el tipo */}
                                {/* ... */}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center py-2 text-gray-500"></div>
                </div>
              </div>
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;