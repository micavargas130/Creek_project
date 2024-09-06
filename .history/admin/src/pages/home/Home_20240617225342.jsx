import { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import { useNavigate } from "react-router-dom";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import { UserContext } from "../../context/UserContext.jsx";
import Table from "../../components/table/Table";
import MapComponent from "../../components/map/mapComponent.jsx";



const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [lodgesInfo, setLodgesInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tents/occupiedPositions");
        const { occupiedPositions } = response.data;

        const lodgesResponse = await axios.get("http://localhost:3000/lodges");
        setLodgesInfo(lodgesResponse.data);

      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };

    fetchData();
  }, []);

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
          <MapComponent lodgesInfo={lodgesInfo}  />
        </div>
      </div>
    </div>
  );
};

export default Home;