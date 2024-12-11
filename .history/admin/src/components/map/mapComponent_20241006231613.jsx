import "./mapComponent.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import FestivalRoundedIcon from '@mui/icons-material/FestivalRounded';
import HouseSidingRoundedIcon from '@mui/icons-material/HouseSidingRounded';
import PoolIcon from '@mui/icons-material/Pool';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GrillIcon from '@mui/icons-material/OutdoorGrillOutlined';
import GarageIcon from '@mui/icons-material/Garage';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';

const MapComponent = ({ onCellClick, tentToCabin, lodgesInfo }) => {
  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);

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
    const { iconType, lodgeState } = getIconType(row, col);

    if (iconType === "HouseSidingRoundedIcon" || lodgeState === "ocupado") {
      return;
    }

    const cellId = `${row}-${col}`;

    if (selectedCell === cellId) {
      setSelectedCell(null);
      onCellClick && onCellClick(null, null, null);
      return;
    }

    setSelectedCell(cellId);
    onCellClick && onCellClick(row, col, iconType);
  };

  const getIconType = (row, col) => {
    const lodge = lodgesInfo.find(
      (lodge) => lodge.location.row === row && lodge.location.col === col
    );
  
    if (lodge) {
      // Verificar correctamente el estado de la cabaña
      return { iconType: "HouseSidingRoundedIcon", lodgeState: lodge.state.status};
    }
  
    let iconType = "";
    let lodgeState = "desocupada";
  
    // Lógica para identificar el icono con base en la posición
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
      <div className="map">
        {Array.from({ length: 8 }, (_, row) => (
          <div key={row} className="map-row">
            {Array.from({ length: 10 }, (_, col) => {
              const { iconType, lodgeState } = getIconType(row, col);

              const isCellOccupied = occupiedPositions.some(
                (pos) => pos.row === row && pos.col === col
              );

              const isLodgeCell = iconType === "HouseSidingRoundedIcon";
              const isTentCell = iconType === "FestivalRoundedIcon";
              const isSelected = selectedCell === `${row}-${col}`;

              return (
                <div
                  key={col}
                  id={`${row}-${col}`}
                  className={`map-cell 
                    ${isCellOccupied ? "occupied" : ""} 
                    ${lodgeState} 
                    ${isLodgeCell && lodgeState === "ocupado" ? "occupiedLodge" : ""} 
                    ${isLodgeCell && lodgeState === "desocupada" ? "emptyLodge" : ""} 
                    ${isLodgeCell && lodgeState === "mantenimiento" ? "maintainedLodge" : ""} 
                    ${isTentCell ? "Activa" : ""} 
                    ${isSelected ? "selected" : ""}`}
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

export default MapComponent;
