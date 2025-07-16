import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import axiosInstance from "../../axios/axiosInstance";
import globalObserver from "../../utils/observer";

const ReturnDepositDialog = ({ open, onClose, selectedParams }) => {
  const deposit = selectedParams?.row?.amount || 0;

  const handleConfirmReturn = async () => {
    try {
      await axiosInstance.put(`/accounting/status/${selectedParams.row._id}`, {
        status: "devuelto",
      });
      globalObserver.notify("accountingChange");
      onClose();
    } catch (error) {
      console.error("Error al marcar como devuelto:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Devolución</DialogTitle>
      <DialogContent>
        <p>Este registro corresponde a una reserva cancelada.</p>
        <p><strong>Seña a devolver:</strong> ${deposit}</p>
        <p>¿Desea marcar este registro como devuelto?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancelar</Button>
        <Button onClick={handleConfirmReturn} color="primary">Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnDepositDialog;
