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
import FilterListIcon from "@mui/icons-material/FilterList";
import { Button, Menu, MenuItem } from "@mui/material";
import useFetch from "../../hooks/useFetch.js";
import { Link } from "react-router-dom";

const List = () => {
  const { data, loading, error } = useFetch("/employees");
  const [filter, setFilter] = useState("all"); // Estado inicial: mostrar todos los empleados
  const [anchorEl, setAnchorEl] = useState(null); // Estado del menú

  // Función para filtrar empleados basados en el estado seleccionado
  const filteredEmployees = () => {
    if (filter === "all") return data;
    return data.filter((employee) => employee.status.name === filter);
  };

  // Manejo del menú desplegable
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (selectedFilter) => {
    if (selectedFilter) {
      setFilter(selectedFilter);
    }
    setAnchorEl(null);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        
        {/* Botón de filtro con menú desplegable */}
        <div className="filterContainer">
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={handleClick}
          >
            Filtrar Empleados
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleClose(null)}>
            <MenuItem onClick={() => handleClose("all")}>Todos</MenuItem>
            <MenuItem onClick={() => handleClose("Activo")}>Activos</MenuItem>
            <MenuItem onClick={() => handleClose("Inactivo")}>Inactivos</MenuItem>
          </Menu>
          
          <Link to="/employees/new" className="addEmployeeButton">
            <AddCircleIcon className="addIcon" />
            <span>Añadir Empleado</span>
          </Link>
        </div>

        {/* Tabla de empleados */}
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
                  <TableCell className="nameCell">{row.user.last_name}</TableCell>
                  <TableCell>
                    <Link to={`/employees/${row._id}`} style={{ textDecoration: "none" }}>
                      <div className="viewButton">View</div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="statusButton">{row.status.name}</div>
                  </TableCell>
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
