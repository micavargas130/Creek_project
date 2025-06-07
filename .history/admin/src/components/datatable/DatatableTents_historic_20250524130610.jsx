import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesourceTents.js";
import useFetch from "../../hooks/useFetch.js";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance.js";
import { useEffect, useState } from "react";


const Datatable = () => {
  const { data } = useFetch("/tents");

  const filteredData = data.filter((item) => item.status && (item.status.status === "Completada" || item.status.status === "Cancelada"));



  const actionColumn = [
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
            <div className="viewButton" onClick={() => handlePaymentClick(params.row)} >
                Info
              </div>
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
        columns={[...userColumns, ...actionColumn]}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={row => row._id}
      />
    </div>
  );
};

export default Datatable;

