import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const Single = () => {
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedJob, setEditedJob] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [editedBaseSalary, setEditedBaseSalary] = useState("");
  const [editedStartDate, setEditedStartDate] = useState("");

  // Options for the status dropdown
  const statusOptions = [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' },
  ];

  // Obtén el ID del usuario de la URL
  const { employeesId } = useParams();

  useEffect(() => {
    axios
      .get(`/employees/${employeesId}`)
      .then((response) => {
        setEmployee(response.data);
        // Inicializar los estados de edición con los valores actuales del empleado
        setEditedJob(response.data.job);
        setEditedStatus(response.data.status);
        setEditedBaseSalary(response.data.base_salary);
        setEditedStartDate(response.data.start_date);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [employeesId]);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleSaveClick = async () => {
    try {
      // Assuming `employee._id` is available in your employee data
      const response = await axios.put(`/employees/${employeesId}`, {
        job: editedJob,
        status: editedStatus,
        base_salary: editedBaseSalary,
        start_date: editedStartDate,
      });

      // Assuming the server responds with the updated employee data
      setEmployee(response.data);
      setEditMode(false); // Disable edit mode after successful update
    } catch (error) {
      console.error('Error updating employee data:', error);
      // Handle error as needed
    }
  };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={handleEditClick}>
              {editMode ? "Cancel" : "Edit"}
              {editMode && (
                <div className="saveButton" onClick={handleSaveClick}>
                  Save
                </div>
              )}
            </div>
            <h1 className="item">
              {employee.name} {employee.last_name}
            </h1>
            <div className="item">
              <div className="details">
                <h2 className="detailItem">
                  Puesto:{" "}
                  {editMode ? (
                    <input
                      type="text"
                      value={editedJob}
                      onChange={(e) => setEditedJob(e.target.value)}
                    />
                  ) : (
                    employee.job
                  )}
                </h2>
                <h2 className="detailItem">
                  Estado:{" "}
                  {editMode ? (
                    <select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    employee.status
                  )}
                </h2>
                <h2 className="detailItem">
                  Salario base:{" "}
                  {editMode ? (
                    <input
                      type="text"
                      value={editedBaseSalary}
                      onChange={(e) => setEditedBaseSalary(e.target.value)}
                    />
                  ) : (
                    employee.base_salary
                  )}
                </h2>
                <h1 className="detailItem">
                  Fecha de ingreso:{" "}
                  {editMode ? (
                    <input
                      type="text"
                      value={editedStartDate}
                      onChange={(e) => setEditedStartDate(e.target.value)}
                    />
                  ) : (
                    employee.start_date
                  )}
                </h1>
              </div>
              <div className="details"></div>
            </div>
          </div>
          <div className="right">
            {employee.photo && (
              <img
                src={employee.photo}
                alt="Employee Photo"
                className="employeePhoto"
              />
            )}
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Información personal</h1>
          <h2 className="detailItem">DNI: {employee.user.dni}</h2>
          <h2 className="detailItem">Cumpleaños: {employee.user.birthday}</h2>
          <h2 className="detailItem">Telefono: {employee.user.phone_number}</h2>
          <h1 className="detailItem">Email: {employee.email}</h1>
        </div>
      </div>
    </div>
  );
};

export default Single;