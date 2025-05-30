export const userColumns = [
    {
      field: "lodge",
      headerName: "Monto",
      width: 80,
    },


    {
      field: "status",
      headerName: "Estado",
      width: 100,
      
      // Usar valueGetter para obtener el valor del estado para filtrado y clasificación
      valueGetter: (params) => {
        const state = params.row.status;
        return state && typeof state === 'object' ? state.status : 'desconocido';
      },
    
      // renderCell para personalizar la apariencia del estado en la tabla
      renderCell: (params) => {
        const status = params.value; // Usa el valor que retorna valueGetter
        return (
          <div className={`cellWithStatus ${status}`}>
            {status}
          </div>
        );
      },
      
      filterable: true, // Habilitar el filtrado
    },

   

    {
      field: "cabain",
      headerName: "Cabaña",
      width: 130,
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
  