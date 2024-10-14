import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import Table from "@mui/material/Table";
import Navbar from "../../components/navbar/Navbar.jsx";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import useFetch from "../../hooks/useFetch.js";
import { Link } from "react-router-dom";

const List = () => {
  const { data, loading, error } = useFetch("/employees");
  const [filter, setFilter] = useState("all"); // Estado inicial: mostrar todos los empleados

  // Función para filtrar empleados basados en el estado seleccionado
  const filteredEmployees = () => {
    if (filter === "all") {
      return data;
    } else {
      return data.filter((employee) => employee.status === filter);
    }
  };

  if (data) {
    console.log("Employees data:", data);
  }


  

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <Link to="/employees/new" style={{ textDecoration: "none" }}>
          <AddCircleIcon />
          <span>Add new</span>
        </Link>
        <div className="filterButtons">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("Activo")}>Active</button>
          <button onClick={() => setFilter("Inactivo")}>Inactive</button>
        </div>
        <TableContainer component={Paper} className="table">
          <Table sx={{ minWidth: 0 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Photo</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees().map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    <div className="cellWrapper">
                      <img src={row.photo} alt="" className="image" />
                    </div>
                  </TableCell>
                  <TableCell className="nameCell">{row.user.first_name}</TableCell>
                  <TableCell className="nameCell">{row.last_name}</TableCell>
                  <TableCell>
                    <Link
                      to={`/employees/${row._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="viewButton">View</div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="stateButton">{row.status}</div>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default List;
