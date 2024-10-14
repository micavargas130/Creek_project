import React, { useState } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import axios from "axios";
import { userColumns } from "../../datatablesourceAccounting.js";

const Datatable = () => {
  const [data, setData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParams, setSelectedParams] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("pagada");

  const fetchData = async () => {
    try {
      const response = await axios.get("/accounting");
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const openDialog = (params) => {
    setSelectedParams(params);
    setSelectedStatus(params.row.status); // Set the current status
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleStatusChange = async () => {
    try {
      await axios.put(`/accounting/${selectedParams.row._id}`, {
        status: selectedStatus,
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    } finally {
      closeDialog();
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Acción",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Button onClick={() => openDialog(params)}>
              Cambiar Estado
            </Button>
          </div>
        );
      },
    },
  ];

  const handleStatusSelect = (event) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <div className="datatable">
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />

      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Cambiar Estado del Pago</DialogTitle>
        <DialogContent>
          <select value={selectedStatus} onChange={handleStatusSelect}>
            <option value="pagada">Pagada</option>
            <option value="parcial">Parcial</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleStatusChange} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Datatable;
