import WidgetsContainer from "../../components/widget/widgetContainer"; // Importa WidgetsContainer
import { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Table from "..components\table\Table.jsx"
import Notifications from "../../components/chart/Chart.jsx";
import "./home.scss";
import LodgeWidget from "../../components/widget/widgetLodges.jsx";
import TentWidget from "../../components/widget/widgetTent.jsx";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import axios from "axios";
import MapComponent from "../../components/map/mapComponent.jsx";
import { getTotalMoney, getIncomes, getExpenses } from "../../components/widget/accountingUtils"; // Importa las funciones de utilidades

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [lodgesInfo, setLodgesInfo] = useState([]);
  const [accountingData, setAccountingData] = useState([]); // Agrega estado para datos de contabilidad
  const [occupiedCount, setOccupiedCount] = useState(0); 
  const [tentCount, setTentCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Datos de cabañas
        const response = await axios.get("http://localhost:3000/tents/occupiedPositions");
        const { occupiedPositions } = response.data;
        
        const lodgesResponse = await axios.get("http://localhost:3000/lodges");
        const lodges = lodgesResponse.data;
        const occupiedLodges = lodges.filter(lodge => lodge.state.status === "ocupado");
        setOccupiedCount(occupiedLodges.length);
        setLodgesInfo(lodgesResponse.data);

        //Datos de carpas
        const tentsResponse = await axios.get("http://localhost:3000/tents");
        const tents = tentsResponse.data;
        const completedTents = tents.filter(tent => tent.status.status === "Activa");
        setTentCount(completedTents.length);

        //Datos de contabilidad
        const accountingResponse = await axios.get("http://localhost:3000/accounting");
        setAccountingData(accountingResponse.data);
      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };

    fetchData();
  }, []);

  // Calcula los valores para los widgets usando los datos de contabilidad
  const totalIncome = getIncomes(accountingData);
  const totalExpense = getExpenses(accountingData);
  const totalMoney = getTotalMoney(accountingData);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <h2>Bienvenido {user.first_name} {user.last_name}</h2>
        <div className="widgets">
          <WidgetsContainer 
            totalMoney={totalMoney} 
            totalIncome={totalIncome} 
            totalExpense={totalExpense} 
          />
           <LodgeWidget occupiedCount={occupiedCount} />
           <TentWidget title="Total Carpas" count={tentCount} />
        </div>
        <div className="charts">
          <MapComponent lodgesInfo={lodgesInfo} />
          <Notifications />
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;
