import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useFetch from "../../hooks/useFetch.js";

const List = () => {
  const { data, loading, error } = useFetch("/employees");

  return (
    <div className="list">
    <Sidebar/>
    <div className="listContainer">
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 0 }} aria-label="simple table">
        <TableHead></TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row._id}>
              <TableCell>
                <div className="cellWrapper">
                  <img src={row.img} alt="" className="image" />
                </div>
              </TableCell>
              <TableCell className="nameCell">{row.name}</TableCell>
              <TableCell className="nameCell">{row.last_name}</TableCell>
              <TableCell>
                <button> coso </button>
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