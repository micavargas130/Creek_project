export const userColumns = [
  { field: "_id", headerName: "ID", width: 70 },

  {
    field: "name",
    headerName: "Cabaña",
    width: 200,
  },

  {
    field: "capacity",
    headerName: "Capacidad",
    width: 100,
  },
  {
    field: "status",
    headerName: "Estado",
    width: 120,
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
    width: 200,
    renderCell: (params) => {
      // Asegurarse de que el comentario es un string antes de renderizar
      const comment = typeof params.row.comment === 'string' ? params.row.comment : '';
      return <div>{comment}</div>;
    },
  },
];
