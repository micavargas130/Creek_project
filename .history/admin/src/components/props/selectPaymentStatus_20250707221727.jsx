// components/props/SelectPaymentStatus.jsx
import React from "react";

const SelectPaymentStatus = ({
  amountToPay,
  selectedStatus,
  partialPayment,
  setSelectedStatus,
  setPartialPayment,
  onConfirm,
  onCancel,
  selectedBooking
}) => {
  return (
    <div className="modal">
      <div className="modalContent">
        <h2>Seleccionar estado del pago</h2>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="pagada">Pagada</option>
          <option value="parcial">Parcial</option>
        </select>

        {selectedStatus === "parcial" ? (
          <div>
            <p>Monto asignado: ${amountToPay}</p>
            <label htmlFor="partialPayment">Monto entregado:</label>
            <input
              type="number"
              id="partialPayment"
              placeholder="Ingrese monto parcial"
              value={partialPayment || ""}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > amountToPay) {
                  alert("El monto no puede ser mayor al total a pagar.");
                } else {
                  setPartialPayment(value);
                }
              }}
            />
          </div>
        ) : (
          <p>Monto asignado: ${amountToPay}</p>
        )}
        <Button onClick={onConfirm} disabled={loading}>
  {loading ? <CircularProgress size={20} /> : "Confirmar"}
</Button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
};

export default SelectPaymentStatus;
