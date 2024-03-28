import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import Tooltip from '@mui/material/Tooltip';

const List = () => {
  const { data, loading, error } = useFetch("/employees");

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 0}} aria-label="simple table">
        <TableHead>
        </TableHead>
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
              <button>'>'</button>
              </TableCell>
              <TableCell>
              </TableCell>
          
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </TableContainer>
  );
};

export default List;