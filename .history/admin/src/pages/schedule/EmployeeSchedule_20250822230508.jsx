import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import axiosInstance from "../../axios/axiosInstance";
import globalObserver from "../../utils/observer.js"; // al inicio del archivo
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const EmployeeSchedule = () => {
  const [events, setEvents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    fetchSchedules();
  
    axiosInstance.get("/api/employees").then((response) => {
      setEmployees(response.data);
    });
  
    const handleScheduleChange = () => {
      fetchSchedules(); 
    };
  
    globalObserver.subscribe("scheduleChange", handleScheduleChange);
  
    return () => {
      globalObserver.unsubscribe("scheduleChange", handleScheduleChange);
    };
  }, []);
  

  const fetchSchedules = async () => {
  try {
    const res = await axiosInstance.get("/api/schedules");
    const formattedEvents = res.data.map((event) => ({
      id: event._id,
      title: `${event.task} - ${event.description}`,
      start: new Date(event.startDate), 
      end: new Date(event.endDate),     
      employeeId: event.employee._id,
    }));
    
    setEvents(formattedEvents);
    console.log("aver", events;
  } catch (error) {
    console.error("Error al obtener horarios:", error);
  }
};

  
  //filtrar eventos según el empleado seleccionado
  const filteredEvents = selectedEmployee
    ? events.filter((event) => event.employeeId === selectedEmployee)
    : events;

  return (
    <div style={{ height: 600, margin: "20px" }}>
      <h2>Horario de empleados</h2>

      {/* Selector de empleados */}
      <label>Filtrar por empleado:</label>
      <select onChange={(e) => setSelectedEmployee(e.target.value)} value={selectedEmployee}>
        <option value="">Todos</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.user.first_name} {emp.user.last_name}
          </option>
        ))}
      </select>

      {/* Calendario */}
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, marginTop: "20px" }}
      />
    </div>
  );
};

export default EmployeeSchedule;
