/* eslint-disable react/prop-types */
import { useLocation, useNavigate } from "react-router-dom";
import "./searchItem.css";
import { useState } from "react";
import { FaUsers, FaConciergeBell } from "react-icons/fa";

const SearchItem = ({ item }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dates] = useState(location.state.dates);
  const [options] = useState(location.state.options);

  const handleClick = () => {
    navigate(`/lodges/${item._id}`, { state: { dates, options } });
  };

  return (
    <div className="searchItemCard">
      <img
        src={item.photos[0] ? `https://creek-project.onrender.com/${item.photos[0]}` : "ruta/a/imagen_por_defecto.jpg"}
        alt={item.name}
        className="cardImg"
      />
      <div className="cardContent">
        <h2 className="cardTitle">{item.name}</h2>
        <div className="cardInfo">
          <span><FaConciergeBell /> Servicios: {item.services}</span>
          <span><FaUsers /> Capacidad: {item.capacity}</span>
        </div>
        <div className="cardActions">
          <button className="cardButton" onClick={handleClick}>Reservar</button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
