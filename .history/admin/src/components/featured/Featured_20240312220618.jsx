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


  return (

    <div className="map-container">
  {/* Crear la cuadrícula */}
  <div className="map">
  {Array.from({ length: 8 }, (_, row) => (
  <div key={row} className="map-row">
    {Array.from({ length: 10 }, (_, col) => {
      const isCellOccupied = occupiedPositions.some(
        (pos) => pos.row === Number(row) && pos.col === Number(col)
      );



          return (
          <div
            key={col}
            id={`${row}-${col}`}
            className={`map-cell ${
              isCellOccupied ? "occupied" : ""
            } ${selectedCell.includes(`${row}-${col}`) ? "selected" : ""}`}
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
          );
             } )}
      </div>
    ))}
    </div>
    </div>
  );
};

export default Featured;
