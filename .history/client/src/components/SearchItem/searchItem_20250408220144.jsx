/* eslint-disable react/prop-types */
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./searchItem.css";

// Íconos de MUI
import GroupsIcon from "@mui/icons-material/Groups";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";

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
        src={item.photos[0] ? `http://localhost:3000/${item.photos[0]}` : "ruta/a/imagen_por_defecto.jpg"}
        alt={item.name}
        className="cardImg"
      />
      <div className="cardContent">
        <h2 className="cardTitle">{item.name}</h2>
        <p className="cardDescription">Descripción breve de la cabaña.</p>
        <div className="cardInfo">
          <span><MiscellaneousServicesIcon fontSize="small" /> Servicios: {item.services}</span>
          <span><GroupsIcon fontSize="small" /> Capacidad: {item.capacity}</span>
        </div>
        <div className="cardActions">
          <button className="cardButton" onClick={handleClick}>Reservar</button>
          <div className="cardCancel">
            <span>Cancelación gratuita</span>
            <small>¡Puedes cancelar más tarde!</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
