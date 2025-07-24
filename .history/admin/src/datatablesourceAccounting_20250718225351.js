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
      width: 90,
      
      valueGetter: (params) => {
        const state = params.row.status;
        return state && typeof state === 'object' ? state.status : 'desconocido';
      },
    
      renderCell: (params) => {
        const status = params.value; // Usa el valor que retorna valueGetter
        return (
          <div className={`cellWithStatus ${status}`}>
            {status}
          </div>
        );
      },
      filterable: true, 
    },
 
    {
      field: "date",
      headerName: "Fecha",
      width: 135,
      valueGetter: (params) => {
        const date = new Date(params.row.date);
        return date.toLocaleString("es-US", {
          timeZone: "America/Argentina/Buenos_Aires",
          hourCycle: "h24",
          dateStyle: "short",
          timeStyle: "short",
          
        });
      },
    },

    {
      field: "comment",
      headerName: "Comentario",
      width: 125,
    },

    
  ];
  