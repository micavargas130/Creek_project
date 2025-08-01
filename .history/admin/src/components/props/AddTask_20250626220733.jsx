// components/AddTaskForm.jsx
import React, { useState } from "react";

const AddTask = ({ onSave, onCancel }) => {
  const [task, setTask] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeatWeekly, setRepeatWeekly] = useState(false);

  const handleSubmit = () => {
    if (!task || !startDate || !endDate || !startTime || !endTime) {
      alert("Completá todos los campos");
      return;
    }

    onSave({ task, startDate, endDate, startTime, endTime, repeatWeekly });

    // Reiniciar el formulario si querés
    setTask("");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
    setRepeatWeekly(false);
  };

  return (
    <div className="modalContent">
      <h3>Agregar tarea</h3>
      <div className="formGroup">
        <label>Título:</label>
        <input value={task} onChange={(e) => setTask(e.target.value)} />
      </div>
      <div className="formGroup">
        <label>Fecha inicio:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div className="formGroup">
        <label>Hora inicio:</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>
      <div className="formGroup">
        <label>Fecha fin:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <div className="formGroup">
        <label>Hora fin:</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
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
        <button onClick={handleSubmit} disabled={isLoading} > 
               {isLoading ? "Creando tarea..." : "Crear Tarea"}</button>          
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
};

export default AddTask;
