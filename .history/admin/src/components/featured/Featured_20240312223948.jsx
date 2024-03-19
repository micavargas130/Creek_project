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
import { responsiveFontSizes } from "@mui/material";

const Featured = () => {

  const [occupiedPositions, setOccupiedPositions] = useState([]);

  const [selectedCell, setSelectedCell] = useState([]);
  const [lodgesInfo, setLodgesInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tents/occupiedPositions");
        const { occupiedPositions } = response.data ;
        
  
        console.log("Occupied Positions:", occupiedPositions);

        const lodgesResponse = await axios.get("URL_PARA_OBTENER_CABAÑAS");
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

    
    if (iconType === "FestivalRoundedIcon") {
      const cellId = `${row}-${col}`;
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
