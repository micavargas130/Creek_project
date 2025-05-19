import "./home.scss";
import axiosInstance from "../../axios/axiosInstance.js"
import { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Notifications from "../../components/chart/Chart.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import MapComponent from "../../components/map/mapComponent.jsx";

//Widgets
import WidgetsContainer from "../../components/widget/widgetContainer"; // Importa WidgetsContainer
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
        // Obtener datos de cabañas
        const lodgesResponse = await axiosInstance.get("http://localhost:3000/lodges");
        const lodges = lodgesResponse.data;
        setTotalLodges(lodges.length);
  
        // Obtener estados de cabañas desde `lodge_x_status`
        const lodgeStatusResponse = await axiosInstance.get("http://localhost:3000/lodge_x_status");
        const lodgeStatuses = lodgeStatusResponse.data;
  
        // Obtener el último estado de cada cabaña
        const latestStatuses = lodges.map(lodge => {
          const lodgeHistory = lodgeStatuses
            .filter(status => status.lodge === lodge.id) // Filtra estados de esta cabaña
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Ordena por fecha (más reciente primero)
          console.log("History", lodgeHistory);
          return {
            ...lodge,
            latestStatus: lodgeHistory.length > 0 ? lodgeHistory[0].status.status : "desconocido"
          };
        });

  
        // Filtrar cabañas ocupadas
        const occupiedLodges = latestStatuses.filter(lodge => lodge.latestStatus === "ocupado");
  
        console.log("latest",occupiedLodges);
 
        setOccupiedCount(occupiedLodges.length);
        setLodgesInfo(latestStatuses);
  
        // Obtener datos de carpas
        const tentsResponse = await axiosInstance.get("http://localhost:3000/tents");
        const tents = tentsResponse.data;
        setTotalTents(tents.length);
  
        // Filtrar carpas activas
        const occupiedTents = tents.filter(tent => tent.status.status === "Activa");
        setTentCount(occupiedTents.length);
  
        // Obtener datos de contabilidad
        const accountingResponse = await axiosInstance.get("http://localhost:3000/accounting");
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

  

    {/* Contenedor para los widgets financieros */}
    <div className="financialWidgets">
      <WidgetsContainer 
  totalMoney={totalMoney} 
  totalIncome={totalIncome} 
  totalExpense={totalExpense} 
  occupiedLodges={occupiedCount} 
  totalLodges={totalLodges}
  occupiedTents={tentCount}
  totalTents={totalTents}
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
