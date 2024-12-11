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
        // Asegurarse de que params.row.state es un objeto y extraer el status
        const state = params.row.state;
        return state && typeof state === 'object' ? state.status : 'desconocido';
      },
      renderCell: (params) => {
        const status = params.value; // Utiliza el valor de valueGetter para renderizado
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
      width: 100,
    },

    {
      field: "createdAt",
      headerName: "Fecha",
      width: 100,
    },
    
  ];
  