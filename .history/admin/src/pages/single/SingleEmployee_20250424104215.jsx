import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance.js"
import "./singleEmployee.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./singleEmployee.scss";
import AddTask from "../../components/props/AddTask.jsx";


const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const Single = () => {
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedJob, setEditedJob] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [editedBaseSalary, setEditedBaseSalary] = useState("");
  const [editedStartDate, setEditedStartDate] = useState("");
  const [editedIsAdmin, setEditedIsAdmin] = useState("");
  const [editedIsEmployee, setEditedIsEmployee] = useState("");
  const [events, setEvents] = useState([]);
  const [task, setTask] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showModal, setShowModal] = useState(false);

  const statusOptions = [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' },
  ];
  const { employeeId } = useParams();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (employeeId) {
      axiosInstance.get(`/employees/${employeeId}`).then((response) => {
        setUserId(response.data.user._id);
        setEmployee(response.data);
        setEditedJob(response.data.job);
        setEditedStatus(response.data.status.name);
        setEditedBaseSalary(response.data.base_salary);
        setEditedStartDate(response.data.start_date);
        setEditedIsAdmin(response.data.user.isAdmin);
        setEditedIsEmployee(response.data.user.isEmployee);
        fetchSchedules(); // Usás la función reutilizable acá
        setLoading(false);
      }).catch((err) => {
        setError(err);
        setLoading(false);
      });
    }
  }, [employeeId]);


  const fetchSchedules = async () => {
    try {
      const res = await axiosInstance.get(`/schedule/${employeeId}`); // <-- importante!
      const schedules = res.data;

      const expandedEvents = [];

      schedules.forEach((schedule) => {
        const start = new Date(schedule.startDate);
        const end = new Date(schedule.endDate);
        for (
          let current = new Date(start);
          current <= end;
          current.setDate(current.getDate() + 1)
        ) {
          const formattedDate = current.toISOString().split("T")[0];

          expandedEvents.push({
            id: schedule._id,
            title: schedule.task,
            start: new Date(`${formattedDate}T${schedule.startTime}`),
            end: new Date(`${formattedDate}T${schedule.endTime}`),
          });
        }
      });
      setEvents(expandedEvents);
    } catch (error) {
      console.error("Error al obtener los horarios:", error);
    }
  };

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

      await axiosInstance.post("/schedule", {
        employee: employeeId,
        task,
        startDate,
        endDate,
        startTime,
        endTime,
        repeatWeekly
      });

      // Recargar los eventos del backend
      await fetchSchedules();
      setTask("");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");
      setRepeatWeekly(false);
    } catch (error) {
      console.error("Error creando la tarea:", error);
    }
  };

  const handleSelectEvent = async (event) => {
    const startDate = new Date(event.start).toLocaleDateString("es-AR");
    const endDate = new Date(event.end).toLocaleDateString("es-AR");

    const confirmDelete = window.confirm(
      `¿Seguro que quieres eliminar la tarea "${event.title}"?\n\nEsto eliminará todas las entradas de esta tarea`
    );

    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/schedule/${event.id}`);
        await fetchSchedules(); // Refresca el calendario
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      }
    }
  };


  const handleSaveClick = async () => {
    try {
      const response = await axiosInstance.put(`/employees/update/${employeeId}`, {
        job: editedJob,
        statusName: editedStatus,
        base_salary: editedBaseSalary,
        start_date: editedStartDate,
      });

      const userResponse = await axiosInstance.put(`/user/${userId}`, {
        isAdmin: editedIsAdmin,
        isEmployee: editedIsEmployee
      });

      // Actualiza el estado con los datos actualizados del servidor
      setEmployee(response.data);
      setEditMode(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating employee data:", error);
    }
  };

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="headerSection">
          <div className="infoCard">
            <div className="editButtons">
              <button className="editButton" onClick={handleEditClick}>
                {editMode ? "Cancelar" : "Editar"}
              </button>
              {editMode && (
                <button className="saveButton" onClick={handleSaveClick}>
                  Guardar
                </button>
              )}
            </div>
            <h1>{employee.user?.first_name} {employee.user?.last_name}</h1>
            <div className="detailsGrid">
              <div className="detail">
                <strong>Puesto:</strong>{" "}
                {editMode ? (
                  <input type="text" value={editedJob} onChange={(e) => setEditedJob(e.target.value)} />
                ) : employee.job}
              </div>
              <div className="detail">
                <strong>Estado:</strong>{" "}
                {editMode ? (
                  <select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value)}>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.label}>{option.label}</option>
                    ))}
                  </select>
                ) : employee.status.name}
              </div>
              <div className="detail">
                <strong>Salario base:</strong>{" "}
                {editMode ? (
                  <input type="text" value={editedBaseSalary} onChange={(e) => setEditedBaseSalary(e.target.value)} />
                ) : employee.base_salary}
              </div>
              <div className="detail">
                <strong>Fecha de ingreso:</strong>{" "}
                {editMode ? (
                  <input type="text" value={editedStartDate} onChange={(e) => setEditedStartDate(e.target.value)} />
                ) : employee.start_date}
              </div>
              <div className="detail">
                <strong>Permisos:</strong>{" "}
                {editMode ? (
                  <select
                    value={editedIsAdmin ? "admin" : "employee"}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditedIsAdmin(value === "admin");
                      setEditedIsEmployee(value === "employee");
                    }}
                  >
                    <option value="employee">Empleado</option>
                    <option value="admin">Administrador</option>
                  </select>
                ) : (
                  employee.user?.isAdmin ? "Administrador" : "Empleado"
                )}
              </div>
            </div>
          </div>

          <div className="photoCard">
            {employee.photo && (
              <img src={employee.photo} alt="Foto del empleado" className="employeePhoto" />
            )}
          </div>
        </div>

        <div className="bottomSection">
          <div className="personalInfoCard">
            <h2>Información personal</h2>
            <div className="detailsGrid">
              <div className="detail"><strong>DNI:</strong> {employee.user?.dni}</div>
              <div className="detail"><strong>Cumpleaños:</strong> {employee.user?.birthday}</div>
              <div className="detail"><strong>Teléfono:</strong> {employee.user?.phone}</div>
              <div className="detail"><strong>Email:</strong> {employee.user?.email}</div>
            </div>
          </div>

          <div className="taskSection">

  {showModal && (
    <div className="modal">
      <AddTask
        onSave={async ({ task, startDate, endDate, startTime, endTime, repeatWeekly }) => {
          try {
            await axiosInstance.post("/schedule", {
              employee: employeeId,
              task,
              startDate,
              endDate,
              startTime,
              endTime,
              repeatWeekly,
            });
            await fetchSchedules();
            setShowModal(false);
          } catch (error) {
            console.error("Error creando la tarea:", error);
          }
        }}
        onCancel={() => setShowModal(false)}
      />
    </div>
  )}

  <div className="calendarSection">
    
    <h2>Horario de Trabajo</h2>
    <div className="addTaskButtonContainer">
    <button onClick={() => setShowModal(true)}>+ Agregar tarea</button>
  </div>
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500, marginTop: "20px" }}
      onSelectEvent={handleSelectEvent}
    />
  </div>
</div>

        </div>
      </div>
    </div>
  );

};

export default Single;
