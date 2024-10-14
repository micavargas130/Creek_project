import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch.js";

const Datatable = () => {
  const { data, loading, error } = useFetch("/bookings");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    console.log(data)
    if (data && data.length > 0) {
      const filtered = data.filter(
        (item) =>
          item.status &&
          (item.status.status === "Completada" || item.status.status === "Cancelada")
      );
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
      width: 10,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {params.row.lodge.name}
             
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
        Reservaciones completadas y canceladas
      </div>
     
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={[...namesColumn, ...lodgeNameColumn,...userColumns, ...actionColumn, ...infoColumn ]}
        pageSize={9}
        rowsPerPageOptions={[9]}
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
