import { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MapComponent from "../../components/map/mapComponent.jsx";
 // Asegúrate de importar MapComponent

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          <MapComponent /> {/* Renderiza MapComponent aquí */}
        </div>
      </div>
    </div>
  );
};

export default Home;
