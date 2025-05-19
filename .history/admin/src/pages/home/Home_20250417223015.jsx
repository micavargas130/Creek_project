import "./home.scss";
import axiosInstance from "../../axios/axiosInstance.js"
import { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Notifications from "../../components/chart/Chart.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import MapComponent from "../../components/map/mapComponent.jsx";
import WidgetsContainer from "../../components/widget/widgetContainer";
import { getTotalMoney, getIncomes, getExpenses } from "../../components/widget/accountingUtils";

// 📅 Calendar imports
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});


const Home = () => {
  const { user } = useContext(UserContext);

  const [lodgesInfo, setLodgesInfo] = useState([]);
  const [accountingData, setAccountingData] = useState([]);
  const [occupiedCount, setOccupiedCount] = useState(0); 
  const [tentCount, setTentCount] = useState(0);
  const [totalLodges, setTotalLodges] = useState(0);
  const [totalTents, setTotalTents] = useState(0);
  const [events, setEvents] = useState([]); // 👈 eventos del calendario del empleado

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lodgesResponse = await axiosInstance.get("http://localhost:3000/lodges");
        setTotalLodges(lodgesResponse.data.length);
        const lodges = lodgesResponse.data;
        const occupiedLodges = lodges.filter(lodge => lodge.latestStatus === "ocupado");
        setOccupiedCount(occupiedLodges.length);
        setLodgesInfo(lodges);

        const tentsResponse = await axiosInstance.get("http://localhost:3000/tents");
        setTotalTents(tentsResponse.data.length);
        const tents = tentsResponse.data;
        const completedTents = tents.filter(tent => tent.status.status === "Activa");
        setTentCount(completedTents.length);

        const accountingResponse = await axiosInstance.get("http://localhost:3000/accounting");
        setAccountingData(accountingResponse.data);

        // ✅ Solo si es empleado, buscá sus tareas
        if (user.isEmployee) {
          const employeeRes = await axiosInstance.get(`/user/${user._id}`);
          const employeeId = employeeRes.data._id;

          const scheduleRes = await axiosInstance.get(`/schedule?employeeId=${employeeId}`);
          const formattedEvents = scheduleRes.data.map((event) => ({
            id: event._id,
            title: event.task,
            start: new Date(`${event.date}T${event.startTime}`),
            end: new Date(`${event.date}T${event.endTime}`),
          }));
          setEvents(formattedEvents);
        }

      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };

    fetchData();
  }, [user]);

  const totalIncome = getIncomes(accountingData);
  const totalExpense = getExpenses(accountingData);
  const totalMoney = getTotalMoney(accountingData);

  return (
    <div className="home">
  <Sidebar />
  <div className="homeContainer">
    <Navbar />
    <h2>Bienvenido {user.first_name} {user.last_name}</h2>

   
   
      <div className="employeeCalendar">
        <h3>Tus tareas asignadas</h3>
        <div className="calendarCard">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400 }}
          />
        </div>
      </div>
  

    {/* Mapa y notificaciones (se muestran a todos) */}
    <div className="charts">
      <MapComponent lodgesInfo={lodgesInfo} />
      <Notifications />
    </div>
  </div>
</div>

  );
};

export default Home;
