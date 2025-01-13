/* eslint-disable react/prop-types */
import {useLocation, useNavigate } from "react-router-dom";
import "./searchItem.css";
import { useState } from "react";


const SearchItem = ({ item }) => {

  const navigate = useNavigate();
    const location = useLocation();
    const [dates] = useState(location.state.dates);
    const [options] = useState(location.state.options);

    const handleClick = () => {
        navigate(`/lodges/${item._id}`, { state: { dates, options } });
    };

    

    return (
        <div className="searchItem">
            <img
               src={item.photos?.[0] ? `http://localhost:3000/${item.photos[0]}` : "ruta/a/imagen_por_defecto.jpg"}
               alt={item.name}
               className="siImg"
            />
            <div className="siDesc">
                <h1 className="siTitle">{item.name}</h1>
                <span className="siSubtitle">Descripción:</span>
                <span className="siFeatures">Servicios: {item.services}</span>
                <span className="siFeatures">Capacidad: {item.capacity}</span>
            </div>
            <div className="siDetails">
                <div className="siDetailTexts">
                    <button onClick={handleClick} className="siCheckButton">Reservar</button>
                    <span className="siCancelOp">Cancelación gratuita</span>
                    <span className="siCancelOpSubtitle">¡Puedes cancelar más tarde!</span>
                </div>
            </div>
        </div>
    );
};

export default SearchItem;