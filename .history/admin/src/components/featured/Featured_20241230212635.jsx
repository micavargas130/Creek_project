import "./featured.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import FestivalRoundedIcon from '@mui/icons-material/FestivalRounded';
import HouseSidingRoundedIcon from '@mui/icons-material/HouseSidingRounded';
import PoolIcon from '@mui/icons-material/Pool';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GrillIcon from '@mui/icons-material/OutdoorGrillOutlined';
import GarageIcon from '@mui/icons-material/Garage';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';

const Featured = () => {

  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [selectedCell, setSelectedCell] = useState([]);
  const [lodgesInfo, setLodgesInfo] = useState([]);
  const [tentInfo, setTentInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //trae las posiciones que ocupan las cabañas.
        const response = await axios.get("http://localhost:3000/tents/occupiedPositions");
        //Guarda las posiciones en el array occupiedPositions
        const { occupiedPositions } = response.data ;
        
        const lodgesResponse = await axios.get("http://localhost:3000/lodges");
        setLodgesInfo(lodgesResponse.data);
  
        // Verificar las coordenadas exactas de cada posición ocupada
        occupiedPositions.forEach(pos => {
          console.log(``);
        });
  
        setOccupiedPositions(occupiedPositions);
      } catch (error) {
        console.error("Error al obtOccupied Position (${pos.row}, ${pos.col})ener datos del servidor", error);
      }
    };
  
    fetchData();
  }, []);

  const handleCellClick = (row, col) => {
    const iconType = getIconType(row, col);
    const lodge = lodgesInfo.find(lodge => lodge.location.row === row && lodge.location.col === col);
    
    const cellId = `${row}-${col}`;
    setOccupiedPositions([...occupiedPositions, cellId]);
  
    // Desseleccionar la celda anterior (si hay alguna)
    if (selectedCell) {
      setSelectedCell(null);
    }
  
    setSelectedCell(cellId);
  };

  // Función para obtener el tipo de icono en una posición específica
  const getIconType = (row, col) => {
    const lodge = lodgesInfo.find(
      (lodge) => lodge.location.row === row && lodge.location.col === col
    );
    const lodgeState = lodge ? lodge.state.toLowerCase() : "desocupada";
    let iconType = "";
  
    if (row >= 2 && col >= 0 && col < 2) {
      iconType = "HouseSidingRoundedIcon";
    } else if (row === 5 && col === 2) {
      iconType = "OtherHousesIcon";
    } else if (row >= 6 && col >= 2 && col < 4) {
      iconType = "PoolIcon";
    } else if (row >= 5 && col >= 3 && col < 4) {
      iconType = "RestaurantIcon";
    } else if (row >= 3 && col >= 8) {
      iconType = "GarageIcon";
    } else if (row >= 3 && row <= 4 && col >= 2 && col <= 4) {
      iconType = "GrillIcon";
    } else {
      iconType = "FestivalRoundedIcon";
    }
  
    return { iconType, lodgeState };
  };

  return (
    <div className="map-container">
      {/* Crear la cuadrícula */}
      <div className="map">
        {Array.from({ length: 8 }, (_, row) => (
          <div key={row} className="map-row">
            {Array.from({ length: 10 }, (_, col) => {

            // Agrega una clase según el estado de la cabaña
             const { iconType, lodgeState } = getIconType(row, col);

              //La función devuelve true si alguna de las posiciones en occupiedPositions tiene las mismas coordenadas (row, col) que las que se están buscando en el momento.
              const isCellOccupied = occupiedPositions.some(
                (pos) => pos.row === row && pos.col === col
              );

             const isLodgeCell = iconType === "HouseSidingRoundedIcon";
             const isTentCell = iconType === "FestivalRoundedIcon";
              return (
                <div
                  key={col}
                  id={`${row}-${col}`}
                  className={`map-cell 
                    ${isCellOccupied ? "occupied" : ""} 
                    ${lodgeState} 
                    ${isLodgeCell && lodgeState === "ocupado" ? "occupiedLodge" : ""} 
                    ${isLodgeCell && lodgeState === "desocupada" ? "emptyLodge" : ""} 
                    ${isLodgeCell && lodgeState === "mantenimiento" ? "mantainedLodge" : ""} 
                    ${isTentCell ? "Activa" : ""} 
                    ${selectedCell.includes(`${row}-${col}`) ? "selected" : ""}`}
                  onClick={() => handleCellClick(row, col)}
                >
                {iconType === "HouseSidingRoundedIcon" && (                                  
                  <HouseSidingRoundedIcon className="house-cell" />
                )}
                {iconType === "FestivalRoundedIcon" && (
                  <FestivalRoundedIcon className="icon" />
                )}
                {iconType === "OtherHousesIcon" && (
                  <OtherHousesIcon className="mainhouse-cell" />
                )}
                {iconType === "PoolIcon" && (
                  <PoolIcon className="pool-cell" />
                )}
                {iconType === "RestaurantIcon" && (
                  <RestaurantIcon className="restaurant-cell" />
                )}
                {iconType === "GarageIcon" && (
                  <GarageIcon className="garage-cell" />
                )}
                {iconType === "GrillIcon" && (
                  <GrillIcon className="grill-cell" />
                )}
              </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;
