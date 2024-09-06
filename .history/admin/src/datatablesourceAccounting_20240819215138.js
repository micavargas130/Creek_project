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
      headerName: "Estado",
      width: 120,
      renderCell: (params) => {
        // Asegurarse de que params.row.state es un objeto y extraer el status
        const state = params.row.status;
        const status = state && typeof state === 'object' ? state.status : 'desconocido';
        return (
          <div className={`cellWithStatus ${status}`}>
            {status}
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
  