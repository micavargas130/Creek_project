import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesourceTents.js";
import {  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";

const Datatable = () => {
  const { data, loading, error } = useFetch("/tents");
  
  const navigate = useNavigate();

  const filteredData = data.filter(item => item.status === "Completada");
  
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Reservaciones completadas y canceladas
      </div>
      <DataGrid
        className="datagrid"
        rows={filte}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={row => row._id}
      />
    </div>
  );
};

export default Datatable;

