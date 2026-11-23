/* eslint-disable react/prop-types */
import { useLocation, useNavigate } from "react-router-dom";
import "./searchItem.css";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { API_URL } from "../../config.js";
import { FaUsers, FaConciergeBell } from "react-icons/fa";

const SearchItem = ({ item }) => {
  const navigate = useNavigate();
  const location = useLocation();
  //si se entra directo por URL no hay state: se usan los datos de la busqueda guardados en el contexto
  const search = useContext(SearchContext);
  const [dates] = useState(location.state?.dates || search.dates);
  const [options] = useState(location.state?.options || search.options);

  const handleClick = () => {
    navigate(`/lodges/${item._id}`, { state: { dates, options } });
  };

  return (
    <div className="searchItemCard">
      <img
        src={item.photos?.[0] ? `${API_URL}/${item.photos[0]}` : "/images/logoCamping.png"}
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
