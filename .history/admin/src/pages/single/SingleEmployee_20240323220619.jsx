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

  // Obtén el ID del usuario de la URL
  const { employeesId } = useParams();


  useEffect(() => {
    axios.get(`/employees/${employeesId}`)
      .then((response) => {
        setEmployee(response.data);
         })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [employeesId]);

  
  
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
          <div className="editButton">Edit</div>
           
              <h1 className="item">
                {employee.name} {employee.last_name}
              </h1>
              <div className="item">
              <div className="details">
              <h2 className="detailItem">Puesto: {employee.birthday} </h2>
              <h2 className="detailItem">Estado: {employee.birthday} </h2>
              <h2 className="detailItem">Salario base: {employee.phone_number} </h2>
              <h1 className="detailItem">Fecha de ingreso:{employee.email} </h1>
¿
              </div>
              <div className="details">
              </div>
            </div>
          </div>
        </div>
        <div className = "right">
        photo
        </div>
        <div className="bottom">
          <h1 className="title">Información personal</h1>
          <h2 className="detailItem">DNI: {employee.birthday} </h2>
          
          <h2 className="detailItem">Cumpleaños: {employee.birthday} </h2>
          <h2 className="detailItem">Telefono: {employee.phone_number} </h2>
          <h1 className="detailItem">Email:{employee.email}</h1>
        </div>
      </div>
    </div>
  );
};
export default Single;