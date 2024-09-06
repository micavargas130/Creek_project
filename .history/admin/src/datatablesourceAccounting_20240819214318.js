export const userColumns = [
    {
      field: "amount",
      headerName: "Monto",
      width: 100,
    },
  
    {
      field: "type",
      headerName: "Tipo",
      width: 100,
      renderCell: (params) => {
        return (
          <div className={`cellWithType ${params.row.type}`}>
            {params.row.type}
          </div>
        );
      },
    },

    {
      field: "status",
      headerName: "Tipo",
      width: 100,
      renderCell: (params) => {
        return (
          <div className={`cellWithType ${params.row.type}`}>
            {params.row.type}
          </div>
        );
      },
    },

    {
      field: "user",
      headerName: "Cliente",
      width: 140,
    },

    {
      field: "cabain",
      headerName: "Cabaña",
      width: 160,
    },

    
    {
      field: "date",
      headerName: "Date",
      width: 160,
    },

    {
      field: "comment",
      headerName: "Comentario",
      width: 100,
    },

    
  ];
  