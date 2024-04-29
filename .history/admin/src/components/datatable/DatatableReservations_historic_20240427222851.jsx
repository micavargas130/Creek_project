import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource.js";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";

const Datatable = () => {
  const { data, loading, error } = useFetch("/bookings");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Filtrar las reservas para mostrar solo las que tienen estado "completado" o "cancelado"
    if (data && data.length > 0) {
      const filtered = data.filter(item => item.status === "Completada" || item.status === "Cancelada");
      setFilteredData(filtered);
    }
  }, [data]); // Este efecto se ejecutará cada vez que 'data' cambie.


  const infoColumn = [
    {
      field: "action",
      headerName: "Cliente",
      width: 200,
      renderCell: (params) => {
        // Implementación de la celda de acción (modificar según sea necesario)
        return (
          <div className="cellAction">
            {/* Ejemplo de botones de acción */}
            <div className={`cellStatus ${params.row.status}`}>{params.row.status}</div>
          </div>
        );
      },
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        // Implementación de la celda de acción (modificar según sea necesario)
        return (
          <div className="cellAction">
            {/* Ejemplo de botones de acción */}
            <div className={`cellStatus ${params.row.status}`}>{params.row.status}</div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Reservaciones completadas y canceladas
      </div>
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={userColumns.concat(actionColumn, infoColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={row => row._id}
      />
    </div>
  );
};

export default Datatable;
