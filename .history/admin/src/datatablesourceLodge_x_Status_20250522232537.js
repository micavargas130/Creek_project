export const Lodge_x_StatusColumns = [

 {
    field: "createdAt",
    headerName: "Fecha y hora",
    width: 200,
    // FORMATO personalizado
    valueGetter: (params) => {
      const rawDate = params.row.createdAt;
      const date = new Date(rawDate);
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      return date.toLocaleString("es-AR", options); // cambia "es-AR" por tu localización si querés
    },
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
  