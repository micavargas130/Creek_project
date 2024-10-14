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
    field: "state",
    headerName: "Estado",
    width: 160,
    renderCell: (params) => {
      // Asegurarse de que params.row.state es un objeto y extraer el status
      const state = params.row.state;
      const status = state && typeof state === 'object' ? state.status : 'desconocido';
      return (
        <div className={`cellWithStatus ${status}`}>
          {status}
        </div>
      );
    },
  },

  {
    field: "comment",
    headerName: "Comentario",
    width: 150,
    renderCell: (params) => {
      // Asegurarse de que el comentario es un string antes de renderizar
      const comment = typeof params.row.comment === 'string' ? params.row.comment : '';
      return <div>{comment}</div>;
    },
  },
];
