import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import axiosInstance from "../../axios/axiosInstance";
import globalObserver from "../../utils/observer";

const CompletePaymentDialog = ({
  open,
  onClose,
  selectedParams,
  remainingAmount,
}) => {
  const handleCompletePayment = async () => {
    try {
      await axiosInstance.post(`/accounting/pay/${selectedParams.row._id}`, {
        amount: selectedParams.row.remainingAmount,
        status: "pagada",
      });
      globalObserver.notify("accountingChange");
      onClose();
    } catch (error) {
      console.error("Error al completar el pago:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Completar Pago</DialogTitle>
      <DialogContent>
        <p>
          <strong>Saldo pendiente:</strong> ${remainingAmount}
        </p>
        <p>¿Desea completar el pago?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancelar</Button>
        <Button onClick={handleCompletePayment} color="primary">
          Completar Pago
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompletePaymentDialog;
