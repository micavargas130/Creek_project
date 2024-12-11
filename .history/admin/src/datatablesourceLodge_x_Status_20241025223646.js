export const Lodge_x_StatusColumns = [

  {
    field: "createdAt",
    headerName: "Fecha",
    width: 150,
  },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      valueGetter: (params) => {
        const status = params.row.status;
        // Verificar si status es un objeto y tiene el campo name
        return status && typeof status === 'object' ? status.status : 'desconocido';
      },
      renderCell: (params) => {
        const status = params.value; 
        console.log(params.row.status.status)
        return (
          <div className={`cellWithStatus ${status}`}>
           {status}
          </div>
        );
      },
      filterable: true, // Habilitar el filtrado
    },
    

    {
      field: "comment",
      headerName: "Comentario",
      width: 150,
    },

    
  ];
  