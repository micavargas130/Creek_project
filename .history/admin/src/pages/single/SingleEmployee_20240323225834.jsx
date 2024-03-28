import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const Single = () => {

  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedPosition, setEditedPosition] = useState(""); // Add this line
  const [editedStatus, setEditedStatus] = useState(""); // Add this line
  const [editedBaseSalary, setEditedBaseSalary] = useState(""); // Add this line
  const [editedJoiningDate, setEditedJoiningDate] = useState("");

  // Obtén el ID del usuario de la URL
  const { employeesId } = useParams();


  useEffect(() => {
    axios.get(`/employees/${employee._id}`)
      .then((response) => {
        setEmployee(response.data);
         })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [employeesId]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
  try {
    const response = await axios.put(`/employees/${employee._id}`, {
      position: editedPosition, // replace with the actual edited position
      status: editedStatus, // replace with the actual edited status
      base_salary: editedBaseSalary, // replace with the actual edited base salary
      joining_date: editedJoiningDate, // replace with the actual edited joining date
    });

    setEmployee(response.data);
    setEditMode(false);
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
          </div>
            <h1 className="item">
              {employee.name} {employee.last_name}
            </h1>
            <div className="item">
              <div className="details">
              <h2 className="detailItem">
              Puesto: {editMode ? (
                <input type="text" value={employee.role} />
              ) : (
                employee.role
              )}
            </h2>
            <h2 className="detailItem">
              Estado: {editMode ? (
                <input type="text" value={employee.status} />
              ) : (
                employee.status
              )}
            </h2>
            <h2 className="detailItem">
              Salario base: {editMode ? (
                <input type="text" value={employee.base_salary} />
              ) : (
                employee.base_salary
              )}
            </h2>
            <h1 className="detailItem">
              Fecha de ingreso: {editMode ? (
                <input type="text" value={employee.start_date} />
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
              
              <img src={employee.photo} alt="Employee Photo" className="employeePhoto" />
            )}
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Información personal</h1>
          <h2 className="detailItem">DNI: {employee.dni}</h2>
          <h2 className="detailItem">Cumpleaños: {employee.birthday}</h2>
          <h2 className="detailItem">Telefono: {employee.phone_number}</h2>
          <h1 className="detailItem">Email: {employee.email}</h1>
        </div>
      </div>
    </div>
  );
};

export default Single;
