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
          <option value="pendiente">Pendiente</option>
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

{selectedStatus.toLowerCase() === "seña" && selectedBooking && (
  <div className="summaryBox">
    <p><strong>Cliente:</strong> {selectedBooking.user.first_name} {selectedBooking.user.last_name}</p>
    <p><strong>Total de la reserva:</strong> ${selectedBooking.totalAmount}</p>
    <p><strong>Seña (30%):</strong> ${Math.round(selectedBooking.totalAmount * 0.3)}</p>
    <p><strong>Saldo restante:</strong> ${Math.round(selectedBooking.totalAmount * 0.7)}</p>
  </div>
)}

        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
};

export default SelectPaymentStatus;
