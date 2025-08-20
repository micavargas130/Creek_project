import "./mapComponent.scss";
import { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import FestivalRoundedIcon from '@mui/icons-material/FestivalRounded';
import HouseSidingRoundedIcon from '@mui/icons-material/HouseSidingRounded';
import PoolIcon from '@mui/icons-material/Pool';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GrillIcon from '@mui/icons-material/OutdoorGrillOutlined';
import GarageIcon from '@mui/icons-material/Garage';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import axiosInstance from "../../axios/axiosInstance.js"

const MapComponent = ({ onCellClick, lodgesInfo }) => {
  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/tents/occupiedPositions");
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

    //que estos no se puedan elegir
    const nonSelectableIcons = [
      "HouseSidingRoundedIcon", 
      "OtherHousesIcon",
      "PoolIcon",
      "RestaurantIcon",
      "GarageIcon",
      "GrillIcon"
    ];  

    if (nonSelectableIcons.includes(iconType) || lodgeState === "ocupado") {
      return; // no hacer nada
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
      // Verificar el estado de la cabaña
      return { 
        iconType: "HouseSidingRoundedIcon", 
        lodgeState: lodge.latestStatus || "desocupada", // Utilizar latestStatus para obtener el estado
        lodgeName: lodge.name || "" // Obtener el nombre de la cabaña
      };
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
  
    return { iconType, lodgeState, lodgeName: "" };
  };

return (
  <div className="map-wrapper">
    <h3 className="map-title">Mapa de ocupación</h3>
    <div className="map-container">
      <div className="map">
        {Array.from({ length: 8 }, (_, row) => (
          <div key={row} className="map-row">
            {Array.from({ length: 10 }, (_, col) => {
              const { iconType, lodgeState, lodgeName } = getIconType(row, col);
              const isCellOccupied = occupiedPositions.some(
                 (pos) => pos.location?.row === row && pos.location?.col === col
              );
              const isLodgeCell = iconType === "HouseSidingRoundedIcon";
              const isTentCell = iconType === "FestivalRoundedIcon";
              const isSelected = selectedCell === `${row}-${col}`;

              return (
                <Tooltip
                title={
                  isCellOccupied
                    ? (() => {
                        const tent = occupiedPositions.find(
                          (p) => p.location.row === row && p.location.col === col
                        );
                        return tent
                          ? `${tent.first_name || ""} ${tent.last_name || ""}`
                          : "";
                      })()
                    : isLodgeCell && lodgeState === "ocupado"
                    ? `${lodgeName} - ${lodgesInfo.find(
                        (l) => l.location.row === row && l.location.col === col
                      )?.user?.first_name || ""} ${
                        lodgesInfo.find(
                          (l) => l.location.row === row && l.location.col === col
                        )?.user?.last_name || ""
                      }`
                    : lodgeName
                }
                arrow
                placement="top"
              >
                <div
                  key={col}
                  id={`${row}-${col}`}
                  className={`map-cell 
                    ${isCellOccupied ? "occupied" : ""} 
                    ${lodgeState} 
                    ${isLodgeCell && lodgeState === "ocupado" ? "occupiedLodge" : ""} 
                    ${isLodgeCell && lodgeState === "desocupada" ? "emptyLodge" : ""} 
                    ${isLodgeCell && lodgeState === "mantenimiento" ? "maintainedLodge" : ""} 
                    ${isTentCell ? "" : ""} 
                    ${isSelected ? "selected" : ""}`}
                  onClick={() => handleCellClick(row, col)}
                >
                  {iconType === "HouseSidingRoundedIcon" && <HouseSidingRoundedIcon className="house-cell" />}
                  {iconType === "FestivalRoundedIcon" && <FestivalRoundedIcon className="icon" />}
                  {iconType === "OtherHousesIcon" && <OtherHousesIcon className="mainhouse-cell" />}
                  {iconType === "PoolIcon" && <PoolIcon className="pool-cell" />}
                  {iconType === "RestaurantIcon" && <RestaurantIcon className="restaurant-cell" />}
                  {iconType === "GarageIcon" && <GarageIcon className="garage-cell" />}
                  {iconType === "GrillIcon" && <GrillIcon className="grill-cell" />}
                </div>
              </Tooltip>              

              );
            })}
          </div>
        ))}
      </div>
    </div>
  </div>
);
};

export default MapComponent;
