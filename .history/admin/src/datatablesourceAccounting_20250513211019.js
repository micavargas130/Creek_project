export const userColumns = [
    {
      field: "amount",
      headerName: "Monto",
      width: 80,
    },
  
    {
      field: "type",
      headerName: "Tipo",
      width: 80,
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
      field: "date",
      headerName: "Fecha",
      width: 180,
      renderCell: (params) => {
        const date = new Date(params.row.date);
        return date.toLocaleString("es-US", {
          timeZone: "America/Argentina/Buenos_Aires",
        });
      },
    },

    {
      field: "comment",
      headerName: "Comentario",
      width: 125,
    },

    
  ];
  