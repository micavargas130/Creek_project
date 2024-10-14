// src/pages/home/Home.jsx
import { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Notifications from "../../components/chart/Chart.jsx";
import "./home.scss";
import WidgetsContainer from "../../components/widget/widgetContainer"; // Importa WidgetsContainer

Para crear un widget que cuente la cantidad de cabañas ocupadas, podrías aprovechar el backend que ya has implementado, que tiene una ruta que obtiene todas las cabañas. Luego, puedes contar cuántas de esas cabañas tienen el estado de "ocupado" y mostrarlo en el widget.

A continuación te dejo un ejemplo de cómo podrías hacerlo:

1. Crear el Widget
Primero, puedes crear un componente Widget que reciba la cantidad de cabañas ocupadas como prop.

jsx
Copiar código
// components/widget/LodgeWidget.jsx
import "./widget.scss";

const LodgeWidget = ({ occupiedCount }) => {
  return (
    <div className="widget">
      <div className="left">
        <span className="title">Cabañas Ocupadas</span>
        <span className="counter">{occupiedCount}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          {/* Puedes agregar un ícono o indicador si lo deseas */}
        </div>
      </div>
    </div>
  );
};

export default LodgeWidget;
2. Obtener la cantidad de cabañas ocupadas
Luego, en el componente Home, donde ya tienes una llamada para obtener la información de todas las cabañas, puedes filtrar las que están ocupadas y pasar ese dato al componente del widget.

jsx
Copiar código
import { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Notifications from "../../components/chart/Chart.jsx";
import "./home.scss";
import LodgeWidget from "../../components/widget/widgetLodges.jsx";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de cabañas
        const response = await axios.get("http://localhost:3000/tents/occupiedPositions");
        const { occupiedPositions } = response.data;

        const lodgesResponse = await axios.get("http://localhost:3000/lodges");
        setLodgesInfo(lodgesResponse.data);

        // Obtener datos de contabilidad
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
        </div>
        <div className="charts">
          <MapComponent lodgesInfo={lodgesInfo} />
          <Notifications />
        </div>
      </div>
    </div>
  );
};

export default Home;
