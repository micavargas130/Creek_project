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
        const lodgesResponse = await axiosInstance.get("/lodges");
        setTotalLodges(lodgesResponse.data.length);
        const lodges = lodgesResponse.data;
        const occupiedLodges = lodges.filter(lodge => lodge.latestStatus === "ocupado");
        setOccupiedCount(occupiedLodges.length);
        setLodgesInfo(lodges);

        const tentsResponse = await axiosInstance.get("/tents");
        setTotalTents(34);
        const tents = tentsResponse.data;
        const completedTents = tents.filter(tent => tent.status.status === "Activa");
        setTentCount(completedTents.length);

        const accountingResponse = await axiosInstance.get("/accounting");
        setAccountingData(accountingResponse.data);

        const userRes = await axiosInstance.get(`/user/${user._id}`);
        const userId = userRes.data._id;

        const employeeRes = await axiosInstance.get(`/employees/user/${userId}`);

        const scheduleRes = await axiosInstance.get(`/schedule/${employeeRes.data._id}`);
        const expandedEvents = scheduleRes.data.map((event) => ({
          id: event._id,
          title: `${event.task} - ${event.description || ""}`,
          start: new Date(event.startDate + "T00:00:00"),
          end: new Date(event.endDate + "T23:59:59"), 
        }));

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
          culture="es"
          style={{ height: 400 }}
          messages={{         //no se cambiaba el idioma de los botones asi que lo hice asi :'v
                     today: "Hoy",
                     previous: "Atrás",
                     next: "Siguiente",
                     month: "Mes",
                     week: "Semana",
                     day: "Día",
                     agenda: "Agenda",
                     date: "Fecha",
                     time: "Hora",
                     event: "Evento",
                     noEventsInRange: "No hay eventos en este rango",
                   }}
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
              //cargo de nuevo los eventos
             const scheduleRes = await axiosInstance.get(`/schedule/${employeeRes.data._id}`);
              const expandedEvents = scheduleRes.data.map((event) => ({
                id: event._id,
                title: `${event.task} - ${event.description || ""}`,
                start: new Date(event.startDate + "T00:00:00"),
                end: new Date(event.endDate + "T23:59:59"),
              }));
          
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

    <div className="topSection">
    <MapComponent lodgesInfo={lodgesInfo} />
  
    {/*widgets */}
    <div className="widgetColumn">
      <OccupationWidget
        occupiedLodges={occupiedCount}
        totalLodges={totalLodges}
        occupiedTents={tentCount}
        totalTents={totalTents}
        occupationPercentage={Math.round(((occupiedCount + tentCount) / (totalLodges + totalTents)) * 100)}
      />
      <TentsWidget
        occupiedTents={tentCount}
        totalTents={tentCount}
      />
      <LodgesWidget
        occupiedLodges={occupiedCount}
        totalLodges={totalLodges}
        occupiedTents={tentCount}
        totalTents={totalTents}
        occupationPercentage={Math.round(((occupiedCount + tentCount) / (totalLodges + totalTents)) * 100)}
      />
    </div>

    <Notifications />
    </div>
    </div>
  </div>

  );
};

export default Home;
