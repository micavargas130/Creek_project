import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";

const Datatable = () => {
  const { data, loading, error } = useFetch("/bookings");
  const [ setFilteredData] = useState([]);

  const filteredData = data.filter(item => item.status && (item.status.status === "Cancelada" || item.status.status === "Completada") );

  useEffect(() => {
    // Filtrar las reservas para mostrar solo las que tienen estado "completado" o "cancelado"
    if (data && data.length > 0) {
      const filtered = data.filter(item => item.status === "Completada" || item.status === "Cancelada");
      
      setFilteredData(filtered.reverse());
    }
  }, [data]); 

  const actionColumn = [
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div className={`cellStatus ${params.row.status}`}>{params.row.status}</div>
          </div>
        );
      },
    },
  ];

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
    <div className="datatable">
      <div className="datatableTitle">
        Reservaciones completadas y canceladas
      </div>
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={[...userColumns, ...actionColumn, ...infoColumn]}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={row => row._id}
       
       
      />
    </div>
  );
};

export default Datatable;
