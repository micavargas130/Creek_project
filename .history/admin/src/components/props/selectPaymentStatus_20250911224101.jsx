import { useState } from "react";

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
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (selectedStatus === "pagado") {
        console.log("aca")
        await onConfirm({
          status: "pagado",
          amount: amountToPay,
        });
      } else {
        console.log("aca2")
        await onConfirm({
          status: "parcial",
          amount: partialPayment || 0,
        });
      }
    } finally {
      setLoading(false);
    }
  };

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

        <button onClick={handleConfirm} disabled={loading}>
          {loading ? "Confirmando..." : "Confirmar"}
        </button>
        <button onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default SelectPaymentStatus;
