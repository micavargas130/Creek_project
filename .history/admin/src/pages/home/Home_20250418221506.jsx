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
  const [task, setTask] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  

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

      
        if (user.isEmployee) {
          const userRes = await axiosInstance.get(`/user/${user._id}`);
          const userId = userRes.data._id;
          console.log("user1", userId)
          const employeeRes = await axiosInstance.get(`/employees/user/${userId}`);
          console.log("empleado",employeeRes)
          const scheduleRes = await axiosInstance.get(`/schedule/${employeeRes.data._id}`);
          console.log("schedule!", scheduleRes)
          const formattedEvents = scheduleRes.data.map((event) => ({
            id: event._id,
            title: event.task,
            start: new Date(`${event.startDate}T${event.startTime}`),
            end: new Date(`${event.endDate}T${event.endTime}`),
          }));
          setEvents(formattedEvents);
        }

      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };

    fetchData();
  }, [user]);

  const handleAddTask = async () => {
    if (!task || !startDate || !endDate || !startTime || !endTime) {
      alert("Completá todos los campos");
      return;
    }
  
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      if (start > end) {
        alert("La fecha de inicio no puede ser posterior a la fecha de fin");
        return;
      }
  
      const userRes = await axiosInstance.get(`/user/${user._id}`);
      const employeeRes = await axiosInstance.get(`/employees/user/${userRes.data._id}`);
  
      await axiosInstance.post("/schedule", {
        employee: employeeRes.data._id,
        task,
        startDate,
        endDate,
        startTime,
        endTime,
        repeatWeekly
      });
  
      const scheduleRes = await axiosInstance.get(`/schedule/${employeeRes.data._id}`);
      const formattedEvents = scheduleRes.data.map((event) => ({
        id: event._id,
        title: event.task,
        start: new Date(`${event.startDate}T${event.startTime}`),
        end: new Date(`${event.endDate}T${event.endTime}`),
      }));
      setEvents(formattedEvents);
  
      // Reset form
      setTask("");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");
      setRepeatWeekly(false);
      setShowModal(false);
    } catch (error) {
      console.error("Error creando la tarea:", error);
    }
  };
  
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
      <div className="modalContent">
        <h3>Agregar tarea</h3>
        <div className="formGroup">
          <label htmlFor="task">Título:</label>
          <input id="task" type="text" value={task} onChange={(e) => setTask(e.target.value)} />
        </div>
        <div className="formGroup">
          <label htmlFor="startDate">Fecha Inicio:</label>
          <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="formGroup">
          <label htmlFor="startTime">Hora inicio:</label>
          <input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="formGroup">
          <label htmlFor="endDate">Fin:</label>
          <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="formGroup">
          <label htmlFor="endTime">Hora fin:</label>
          <input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
        <div className="formGroup">
          <label>
            <input
              type="checkbox"
              checked={repeatWeekly}
              onChange={(e) => setRepeatWeekly(e.target.checked)}
            />
            Repetir semanalmente
          </label>
        </div>
        <div className="formActions">
          <button onClick={handleAddTask}>Guardar</button>
          <button onClick={() => setShowModal(false)}>Cancelar</button>
        </div>
      </div>
    </div>
  )}
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
