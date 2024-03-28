import React from "react";
import Sidebar from "../../components/sidebar/Sidebar.jsx"
import Table from "@mui/material/Table";
import Navbar from "../../components/navbar/Navbar.jsx"
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useFetch from "../../hooks/useFetch.js";
import {Link, Navigate} from "react-router-dom";

const List = () => {
  const { data, loading, error } = useFetch("/employees");


  return (
    <div className="list">
    <Sidebar/>
    <div className="listContainer">
    <Navbar/>
    <Link to="/employees/newEmployee" style={{ textDecoration: "none" }}>
            <AddCircleIcon  />
            <span>Add new</span>
          </Link>
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 0 }} aria-label="simple table">
        <TableHead></TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row._id}>
              <TableCell>
                <div className="cellWrapper">
                  <img src={row.photo} alt="" className="image" />
                </div>
              </TableCell>
              <TableCell className="nameCell">{row.name}</TableCell>
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
              <div
              className="stateButton"
            >
              {row.status}
            </div>
              </TableCell>
              <TableCell><TableCell>
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