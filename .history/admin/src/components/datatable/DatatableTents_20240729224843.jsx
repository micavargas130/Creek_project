import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesourceTents.js";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";
import { Link, useNavigate} from "react-router-dom";

const Datatable = () => {
  const {data, loading, error} = useFetch("/tents")
  const [userInLodge, setUserInLodge] = useState(null);
  const navigate = useNavigate()

  const filteredData = data.filter(
    (item) =>
      item.status &&
      (item.status.status === "Activa")
  );

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
            await axios.put(`tents/${params.row._id}/updateStatusCompleted`);
            window.location.reload();
          } catch (error) {
            console.error("Error deleting tent:", error);
          }
        };

        const infoColumn = [
          {
            field: "info",
            headerName: "Info del Cliente",
            width: 150,
            renderCell: (params) => {
              return (
                <Link to={`/bookings/${params.row._id}`} style={{ textDecoration: "none" }}>
                  <div className="viewButton">View</div>
                </Link>
              );
            },
          },
        ];
      


        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={handleCancelClick}
            >
              Finalizar
            </div>

          </div>
        );
      },
    },
  ];

  const addNewButton = () => {
    // Aquí puedes realizar la acción de mantenimiento con el texto ingresado
    navigate('new');
  };

  const handleHistoricButton = async () => {
    try {

      navigate('historico');
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Reservaciones
      </div>
      <button onClick={addNewButton} className="link">
          Add New
        </button>

      <button onClick={handleHistoricButton}>Historia</button>
      
    
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId = {row => row._id}
      />
    </div>
  );
};

export default Datatable;
