export const Lodge_x_StatusColumns = [
    {
      field: "lodge",
      headerName: "Ca",
      width: 80,
      renderCell: (params) => params.row.name,
    },

    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => params.row.status,
    
    },

    {
      field: "comment",
      headerName: "Comentario",
      width: 100,
    },

    {
      field: "createdAt",
      headerName: "Fecha",
      width: 100,
    },
    
  ];
  