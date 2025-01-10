import "./home.scss";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Notifications from "../../components/chart/Chart.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import MapComponent from "../../components/map/mapComponent.jsx";

//Widgets
import WidgetsContainer from "../../components/widget/widgetContainer"; // Importa WidgetsContainer
import LodgeWidget from "../../components/widget/widgetLodges.jsx";
import TentWidget from "../../components/widget/widgetTent.jsx";
import OccupationWidget from "../../components/widget/occupationWidget.jsx";
import { getTotalMoney, getIncomes, getExpenses } from "../../components/widget/accountingUtils"; // Importa las funciones de utilidades



const Home = () => {
  const { user } = useContext(UserContext);

  const [lodgesInfo, setLodgesInfo] = useState([]);
  const [accountingData, setAccountingData] = useState([]); // Agrega estado para datos de contabilidad
  const [occupiedCount, setOccupiedCount] = useState(0); 
  const [tentCount, setTentCount] = useState(0);
  const [totalLodges, setTotalLodges] = useState(0);
  const [totalTents, setTotalTents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Datos de cabañas       
        const lodgesResponse = await axios.get("http://localhost:3000/lodges");
        setTotalLodges(lodgesResponse.data.length);
        const lodges = lodgesResponse.data;

        const occupiedLodges = lodges.filter(lodge => lodge.state.status === "ocupado");
        setOccupiedCount(occupiedLodges.length);
        setLodgesInfo(lodgesResponse.data);

        //Datos de carpas
        const tentsResponse = await axios.get("http://localhost:3000/tents");
        setTotalTents(tentsResponse.data.length);
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

    {/* Contenedor para widgets de ocupación */}
    <div className="finantialWidgets">
      <LodgeWidget occupiedCount={occupiedCount} />
      <TentWidget title="Total Carpas" count={tentCount} />
      <OccupationWidget 
        occupiedLodges={occupiedCount}
        totalLodges={totalLodges}
        occupiedTents={tentCount}
        totalTents={totalTents}
      />
    </div>

    {/* Contenedor para los widgets financieros */}
    <div className="finantialWidgets">
      <WidgetsContainer 
        totalMoney={totalMoney} 
        totalIncome={totalIncome} 
        totalExpense={totalExpense} 
      />
    </div>

    

    {/* Mapa y notificaciones */}
    <div className="charts">
      <MapComponent lodgesInfo={lodgesInfo} />
      <Notifications />
    </div>
  </div>
</div>
  );
};

export default Home;
