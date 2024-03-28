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
      {/* ... (existing code) */}
      <div className="top">
        <div className="left">
          {/* ... (existing code) */}
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
      {/* ... (existing code) */}
    </div>
  );
};

export default Single;
export default Single;