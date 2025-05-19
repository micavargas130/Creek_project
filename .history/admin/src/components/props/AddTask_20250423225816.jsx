// components/props/AddTask.jsx
import React, { useState } from "react";
import axiosInstance from "../../axios/axiosInstance";

const AddTask = ({ onCancel, onSuccess }) => {
  const [task, setTask] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeatWeekly, setRepeatWeekly] = useState(false);

  const handleSave = async () => {
    if (!task || !startDate || !endDate || !startTime || !endTime) {
      alert("Completá todos los campos");
      return;
    }

    const userRes = await axiosInstance.get(``);
    const employeeRes = await axiosInstance.get(`/employees/user/${userRes.data._id}`);

    await axiosInstance.post("/schedule", {
      employee: employeeRes.data._id,
      task,
      startDate,
      endDate,
      startTime,
      endTime,
      repeatWeekly,
    });

    if (onSuccess) onSuccess();
  };

  return (
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
        <label htmlFor="endDate">Fecha Fin:</label>
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
        <button onClick={handleSave}>Guardar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
};

export default AddTask;
