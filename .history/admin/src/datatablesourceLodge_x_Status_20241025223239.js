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
      valueGetter: (params) => {
        const status = params.row.status;
        // Verificar si status es un objeto y tiene el campo name
        return status && typeof status === 'object' ? status.name : 'desconocido';
      },
      renderCell: (params) => {
        const status = params.value; // Utiliza el valor de valueGetter para renderizado
        return (
          <div className={`cellWithStatus ${status}`}>
           {status.status}
          </div>
        );
      },
      filterable: true, // Habilitar el filtrado
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
  