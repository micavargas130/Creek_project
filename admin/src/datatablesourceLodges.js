export const userColumns = [
    { field: "_id", headerName: "ID", width: 70 },

    {
      field: "name",
      headerName: "Cabaña",
      width: 100,
    },
  
    {
      field: "capacity",
      headerName: "Capacidad",
      width: 100,
    },
    {
      field: "status",
      headerName: "Estado",
      width: 250,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.status}`}>
            {params.row.status}
          </div>
        );
      },
    },
  ];
  