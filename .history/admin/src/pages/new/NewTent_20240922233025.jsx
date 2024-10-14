import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { Navigate } from "react-router-dom";
import MapComponent from "../../components/map/mapComponent.jsx";

// Agrupar iconos de MUI
import {
  FestivalRoundedIcon,
  HouseSidingRoundedIcon,
  PoolIcon,
  RestaurantIcon,
  GrillIcon,
  GarageIcon,
  OtherHousesIcon
} from '@mui/icons-material';

const New = () => {
  // Agrupar los datos del formulario en un solo objeto
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dni: "",
    email: "",
    phone: "",
    ocupation: "",
    checkIn: "",
    checkOut: "",
    numberOfAdults: "",
    numberOfChildren: "",
    location: null,
  });

  const [redirect, setRedirect] = useState(false);
  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [lodgesInfo, setLodgesInfo] = useState([]);
  const [price, setPrice] = useState({});
  const [modalState, setModalState] = useState({
    visible: false,
    selectedStatus: "pagada",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [positionsResponse, lodgesResponse, priceResponse] = await Promise.all([
          axios.get("http://localhost:3000/tents/occupiedPositions"),
          axios.get("http://localhost:3000/lodges"),
          axios.get("http://localhost:3000/prices/66a82bc2ac1709160e479670"),
        ]);

        setOccupiedPositions(positionsResponse.data.occupiedPositions);
        setLodgesInfo(lodgesResponse.data);
        setPrice(priceResponse.data);
      } catch (error) {
        console.error("Error al obtener datos del servidor", error);
      }
    };

    fetchData();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validar fechas de check-in y check-out
  const validarFechas = (checkInStr, checkOutStr) => {
    const checkInDate = new Date(checkInStr);
    const checkOutDate = new Date(checkOutStr);
    const now = new Date();

    if (checkInDate <= now) return "La fecha de check-in debe ser posterior a la fecha actual.";
    if (checkOutDate <= now) return "La fecha de check-out debe ser posterior a la fecha actual.";
    if (checkOutDate <= checkInDate) return "La fecha de check-out debe ser posterior a la de check-in.";
    
    return null;
  };

  // Manejar el envío del formulario
  const newTent = async (ev) => {
    ev.preventDefault();

    const { location, checkIn, checkOut, numberOfAdults, numberOfChildren } = formData;

    if (!location) return alert("Debes seleccionar una posición en el mapa antes de enviar el formulario");
    
    const fechaError = validarFechas(checkIn, checkOut);
    if (fechaError) return alert(fechaError);

    const { row, col } = location;

    try {
      // Crear la carpa
      const tentResponse = await axios.post("http://localhost:3000/tents", { ...formData, location: { row, col } });
      const tentId = tentResponse.data._id;

      // Calcular el monto total basado en los precios
      const totalAmount = (numberOfAdults * price.priceAdult) + (numberOfChildren * price.priceChild);

      // Crear el registro de contabilidad
      const paymentData = {
        amount: totalAmount,
        type: "Ingreso",
        date: new Date().toISOString(),
        user: `${formData.first_name} ${formData.last_name}`,
        tent: tentId,
        comment: "Carpa",
        status: modalState.selectedStatus.toLowerCase(),
      };

      await axios.post("http://localhost:3000/accounting/createAccounting", paymentData);

      alert("Registro exitoso");
      setRedirect(true);
    } catch (err) {
      alert("Error al registrar la carpa");
    }
  };

  if (redirect) return <Navigate to={"/tents"} />;

  return (
    <div className="new">
      {modalState.visible && (
        <div className="modal">
          <div className="modalContent">
            <h2>Seleccionar estado del pago</h2>
            <select value={modalState.selectedStatus} onChange={(e) => setModalState({ ...modalState, selectedStatus: e.target.value })}>
              <option value="pagada">Pagada</option>
              <option value="parcial">Parcial</option>
              <option value="pendiente">Pendiente</option>
            </select>
            <button onClick={() => setModalState({ ...modalState, visible: false })}>Confirmar</button>
            <button onClick={() => setModalState({ ...modalState, visible: false })}>Cancelar</button>
          </div>
        </div>
      )}

      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Añadir una nueva carpa ocupada</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <MapComponent
              onCellClick={(row, col, iconType) => setFormData({ ...formData, location: { row, col } })}
              occupiedPositions={occupiedPositions}
              lodgesInfo={lodgesInfo}
            />
          </div>
          <div className="right">
            <form onSubmit={newTent}>
              <input type="text" name="first_name" placeholder="Nombre" value={formData.first_name} onChange={handleInputChange} />
              <input type="text" name="last_name" placeholder="Apellido" value={formData.last_name} onChange={handleInputChange} />
              <input type="text" name="dni" placeholder="DNI" value={formData.dni} onChange={handleInputChange} />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
              <input type="text" name="phone" placeholder="Telefono" value={formData.phone} onChange={handleInputChange} />
              <input type="text" name="ocupation" placeholder="Ocupación" value={formData.ocupation} onChange={handleInputChange} />
              <input type="date" name="checkIn" value={formData.checkIn} onChange={handleInputChange} />
              <input type="date" name="checkOut" value={formData.checkOut} onChange={handleInputChange} />
              <input type="number" name="numberOfAdults" placeholder="Cantidad de adultos" value={formData.numberOfAdults} onChange={handleInputChange} />
              <input type="number" name="numberOfChildren" placeholder="Cantidad de niños" value={formData.numberOfChildren} onChange={handleInputChange} />
              <button type="submit">Registrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
