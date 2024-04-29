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
      const filtered = data.filter(item => item.status === "Completada" || item.status === "cancelado");
      setFilteredData(filtered);
    }
  }, [data]); // Este efecto se ejecutará cada vez que 'data' cambie.

  

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Reservaciones completadas y canceladas
      </div>

      
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={row => row._id}
      />
    </div>
  );
};

export default Datatable;
