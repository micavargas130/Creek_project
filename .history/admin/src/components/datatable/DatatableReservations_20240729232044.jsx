import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource.js";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";

const Datatable = () => {
  const { data, loading, error } = useFetch("/bookings");
  const [userInLodge, setUserInLodge] = useState(null);
  const navigate = useNavigate();

  // Filtro para mostrar solo las reservas con estado activo
  const filteredData = data.filter(item => item.status && item.status.status === "Activa");

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        const getDatesInRange = (start, end) => {
          const startDate = new Date(start);
          const endDate = new Date(end);
          const dates = [];
        
          // Agregar la fecha de inicio a la lista
          dates.push(new Date(startDate)); // Clonar la fecha
        
          // Calcular las fechas intermedias
          while (startDate < endDate) {
            const newDate = new Date(startDate);
            newDate.setDate(newDate.getDate() + 1);
            dates.push(newDate); // Agregar una copia de la fecha
            startDate.setDate(startDate.getDate() + 1);
          }
        
          // Aplicar el reemplazo a cada elemento del array
          const datesWithReplacement = dates.map((date) => {
            return date.toISOString().replace('T00:00:00.000Z', 'T03:00:00.000Z');
          });
        
          return datesWithReplacement;
        };

        /* BOTON DE CANCELACION */
        const handleCancelClick = async () => {
          try {
            // Cambia el estado de la reserva a cancelado
            await axios.put(`/bookings/${params.row._id}/updateStatusCanceled`);
            // Libera las fechas que habían sido reservadas
            const datesToDelete = getDatesInRange(params.row.checkIn, params.row.checkOut);
            await axios.put(`/lodges/delavailability/${params.row.lodge}`, {
              id: params.row.lodge,
              dates: datesToDelete
            });
            // Actualiza la tabla de datos después de cancelar la reserva
            window.location.reload();
          } catch (error) {
            console.error("Error canceling booking:", error);
          }
        };

        /* BOTON DE LLEGADA */
        const handleArrivalClick = async () => {
          try {
            // Marcar la cabaña como "Ocupado"
            await axios.put(`/lodges/set-occupied/${params.row.lodge}`);

            // Se crea un nuevo ingreso
            const paymentData = {
              amount: params.row.totalAmount,
              type: "Ingreso",
              date: new Date(), // Fecha actual
              user: params.row.name,
              cabain: params.row.placeName,
              comment: "", 
            };

            // Se marca la reserva como Completa
            await axios.put(`/bookings/${params.row._id}/updateStatusCompleted`);
            // Se guarda el nuevo ingreso en la tabla de ingresos
            await axios.post(`/accounting/createAccounting`, paymentData);

            const bookingId = params.row._id;
            
            // Se linkean los datos de la reserva a la cabaña que reservaron y en donde se van a hospedar
            await axios.put(`/lodges/occupiedBy/${params.row.lodge}`, { _id: bookingId });
            // Redirige a la página de cabañas
            navigate('/lodges');
          } catch (error) {
            console.error("Error al marcar la cabaña como ocupada:", error);
          }
        };

        return (
          <div className="cellAction">
            <Link to={`/bookings/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Info</div>
            </Link>
            <div className="deleteButton" onClick={handleCancelClick}>
              Cancelar
            </div>
            <div className="arrivalButton" onClick={handleArrivalClick}>
              ✔
            </div>
          </div>
        );
      },
    },
  ];

  // Botón que lleva al registro histórico
  const handleHistoricButton = async () => {
    try {
      navigate('historic');
    } catch (error) {
      console.error("Error navigating to historic bookings:", error);
    }
  };

  const statusColumn = [
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div className={`cellStatus ${params.row.status.status}`}>
              {params.row.status.status}
            </div>
          </div>
        );
      },
    },
  ];

  const lodgeNameColumn = [
    {
      field: "lodge",
      headerName: "Nombre de Cabaña",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {params.row.lodge.name}
             
            </div>
         
        );
      },
    },
  ];

  const namesColumn = [
    {
      field: "client",
      headerName: "Cliente",
      width: 150,
      renderCell: (params) => {
        return (
            <div className="clientInfo">
              {params.row.user.first_name} {params.row.user.last_name}
            </div>
         
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Reservaciones
        <button onClick={handleHistoricButton}>Historia</button>
      </div>
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={[userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Datatable;
