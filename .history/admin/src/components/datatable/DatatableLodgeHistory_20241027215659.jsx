import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Lodge_x_StatusColumns } from "../../datatablesourceLodge_x_Status.js";
import {useNavigate} from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";

import axios from "axios";

const Datatable = (props) => {
  const {data, loading, error} = useFetch("/lodge_x_status")
  
  const navigate = useNavigate();

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
    <div className="datatable">
      <div className="datatableTitle">Contabilidad</div>
   
      <DataGrid
        className="datagrid"
        rows={data}
        columns={Lodge_x_StatusColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />
    </div>
    </div>
    </div>
  );
};

export default Datatable;
