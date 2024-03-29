import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource.js";
import { Link,  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";

const Datatable = () => {
  const {data, loading, error} = useFetch("/bookings")
  const [userInLodge, setUserInLodge] = useState(null);
  const navigate = useNavigate()

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
            console.log(newDate);
            dates.push(newDate); // Agregar una copia de la fecha
            startDate.setDate(startDate.getDate() + 1);
            console.log(dates);
          }
        
          // Aplicar el reemplazo a cada elemento del array
          const datesWithReplacement = dates.map((date) => {
            return date.toISOString().replace('T00:00:00.000Z', 'T03:00:00.000Z');
          });
        
          return datesWithReplacement;
        };
      
        const handleCancelClick = async () => {
          try {
            await axios.put(`/bookings/${params.row._id}/updateStatusCanceled`);
            const datesToDelete = getDatesInRange(params.row.checkIn, params.row.checkOut);
            await axios.put(`/lodges/delavailability/${params.row.place}`,{
              id: params.row.place,
              dates: datesToDelete
            }); 
      
           // window.location.reload();
          } catch (error) {
            console.error("Error canceling booking:", error);
          }
        };


        const handleArrivalClick = async () => {
          try {
            // Realiza una solicitud para marcar la cabaña como "Ocupado"
            await axios.put(`/lodges/set-occupied/${params.row.place}`);

            const paymentData = {
              amount: params.row.totalAmount,
              type: "Ingreso",
              date: new Date(), // Fecha actual
              user: params.row.name,
              cabain: params.row.placeName,
              comment: "", // Puedes dejarlo vacío o manejarlo según tus necesidades
            };
            await axios.put(`/bookings/${params.row._id}/updateStatusCompleted`);
            await axios.post(`accounting/createAccounting`, paymentData);
            console.log(paymentData)

             const bookingId = params.row._id;

            // Realiza una solicitud al servidor para obtener la información de la reserva
            await axios.put(`/lodges/occupiedBy/${params.row.place}`, { _id: bookingId });
            //await axios.delete(`/bookings/${params.row._id}`);
            

          } catch (error) {
            console.error("Error al marcar la cabaña como ocupada:", error);
          }
        };

        return (
          <div className="cellAction">
            <Link to={`/bookings/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={handleCancelClick}
            >
              Delete
            </div>

            <div
              className="arrivalButton"
              onClick={handleArrivalClick}
            >
               ✔
            </div>
          </div>
        );
      },
    },
  ];


  const handleHistoricButton = async () => {
    try {

      navigate('historic');
     // window.location.reload();
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Reservaciones

        <button onClick={handleHistoricButton}>Historia</button>
      </div>
      
    
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId = {row => row._id}
      />
    </div>
  );
};

export default Datatable;
