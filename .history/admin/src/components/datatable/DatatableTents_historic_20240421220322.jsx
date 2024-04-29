import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesourceTents.js";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";
import axios from "axios";

const Datatable = () => {
  const { data, loading, error } = useFetch("/tents");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();


  return (
    <div className="datatable">
      <div className="datatableTitle">
        Reservaciones completadas y canceladas
      </div>
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={row => row._id}
      />
    </div>
  );
};

export default Datatable;

