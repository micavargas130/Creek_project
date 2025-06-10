import "./home.scss";
import axiosInstance from "../../axios/axiosInstance.js"
import { useContext, useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import AddTask from "../../components/props/AddTask.jsx";
import Notifications from "../../components/chart/Chart.jsx";
import { UserContext } from "../../context/UserContext.jsx";
import MapComponent from "../../components/map/mapComponent.jsx";
import OccupationWidget from "../../components/widget/occupationWidget.jsx";
import TentsWidget from "../../components/widget/widgetTent.jsx";
import LodgesWidget from "../../components/widget/widgetLodges.jsx";
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
  const [events, setEvents] = useState([]); 
  const [showModal, setShowModal] = useState(false);

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

        const userRes = await axiosInstance.get(`/user/${user._id}`);
        const userId = userRes.data._id;

        const employeeRes = await axiosInstance.get(`/employees/user/${userId}`);

        const scheduleRes = await axiosInstance.get(`/schedule/${employeeRes.data._id}`);
        const expandedEvents = [];

        scheduleRes.data.forEach((event) => {
          const start = new Date(event.startDate);
          const end = new Date(event.endDate);
        
          for (
            let current = new Date(start);
            current <= end;
            current.setDate(current.getDate() + 1)
          ) {
            const formattedDate = current.toISOString().split("T")[0];
            expandedEvents.push({
              id: event._id,
              title: event.task,
              start: new Date(`${formattedDate}T${event.startTime}`),
              end: new Date(`${formattedDate}T${event.endTime}`),
            });
          }
        });
         setEvents(expandedEvents);
      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };

    fetchData();
  }, [user]);
  
  return (
    <div className="home">
    <Sidebar />
    <div className="homeContainer">
    <Navbar />
    <h2>Bienvenido {user.first_name} {user.last_name}</h2>
    <div className="employeeCalendar">
    <h3>Tus tareas asignadas</h3>
    <buttonEdit onClick={() => setShowModal(true)}> + Agregar tarea</buttonEdit>
  
    <div className="calendarCard">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400 }}
      />
    </div>
  
    {showModal && (
    <div className="modal">
      <AddTask
        onSave={async (formData) => {
          try {
            const userRes = await axiosInstance.get(`/user/${user._id}`);
            const employeeRes = await axiosInstance.get(`/employees/user/${userRes.data._id}`);
  
            await axiosInstance.post("/schedule", {
            employee: employeeRes.data._id,
            ...formData,
          });

          // Volvé a cargar los eventos
          const scheduleRes = await axiosInstance.get(`/schedule/${employeeRes.data._id}`);
          const expandedEvents = [];

          scheduleRes.data.forEach((event) => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            for (
              let current = new Date(start);
              current <= end;
              current.setDate(current.getDate() + 1)
            ) {
              const formattedDate = current.toISOString().split("T")[0];
              expandedEvents.push({
                id: event._id,
                title: event.task,
                start: new Date(`${formattedDate}T${event.startTime}`),
                end: new Date(`${formattedDate}T${event.endTime}`),
              });
            }
          });

          setEvents(expandedEvents);
          setShowModal(false);
        } catch (error) {
          console.error("Error al guardar la tarea:", error);
        }
      }}
      onCancel={() => setShowModal(false)}
    />
  </div>
)}
</div>

    {/* Mapa y notificaciones (se muestran a todos) */}
    <div className="charts">
      <MapComponent lodgesInfo={lodgesInfo} />
      <OccupationWidget
        occupiedLodges={occupiedCount}
        totalLodges={totalLodges}
        occupiedTents={tentCount}
        totalTents={totalTents}
        occupationPercentage={Math.round(((occupiedCount + tentCount) / (totalLodges + totalTents)) * 100)}
      />  
      <TentWidget
        occupiedLodges={occupiedCount}
        totalLodges={totalLodges}
        occupiedTents={tentCount}
        totalTents={totalTents}
        occupationPercentage={Math.round(((occupiedCount + tentCount) / (totalLodges + totalTents)) * 100)}
      />  
      <LodgesWidget
        occupiedLodges={occupiedCount}
        totalLodges={totalLodges}
        occupiedTents={tentCount}
        totalTents={totalTents}
        occupationPercentage={Math.round(((occupiedCount + tentCount) / (totalLodges + totalTents)) * 100)}
      />  

      <Notifications />
    </div>
  </div>
</div>

  );
};

export default Home;
