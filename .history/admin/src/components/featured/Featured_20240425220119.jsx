import "./featured.scss";
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

const Featured = () => {
  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [lodgesInfo, setLodgesInfo] = useState([]);
  const [maintenanceComment, setMaintenanceComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tents/occupiedPositions");
        const { occupiedPositions } = response.data ;
        console.log("Occupied Positions:", occupiedPositions);

        const lodgesResponse = await axios.get("http://localhost:3000/lodges");
        setLodgesInfo(lodgesResponse.data);
  
        occupiedPositions.forEach(pos => {
          console.log(``);
        });
  
        setOccupiedPositions(occupiedPositions);
      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };
  
    fetchData();
  }, []);

  const handleCellClick = (row, col) => {
    const iconType = getIconType(row, col);
    const lodge = lodgesInfo.find(lodge => lodge.location.row === row && lodge.location.col === col);
    
    setSelectedCell({ row, col });

    if (lodge && lodge.state === "mantenimiento") {
      setMaintenanceComment(lodge.comment);
    } else {
      setMaintenanceComment("");
    }
  };

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
      <div className="map">
        {Array.from({ length: 8 }, (_, row) => (
          <div key={row} className="map-row">
            {Array.from({ length: 10 }, (_, col) => {
              const { iconType, lodgeState } = getIconType(row, col);
              const isCellOccupied = occupiedPositions.some(
                (pos) => pos.row === row && pos.col === col
              );
              const isLodgeCell = iconType === "HouseSidingRoundedIcon";

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
                    ${selectedCell && selectedCell.row === row && selectedCell.col === col ? "selected" : ""}`}
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

                  {/* Mostrar el comentario de mantenimiento */}
                  {selectedCell && selectedCell.row === row && selectedCell.col === col && maintenanceComment && (
                    <div className="maintenance-comment">{maintenanceComment}</div>
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

