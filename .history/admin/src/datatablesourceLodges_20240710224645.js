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
      return (
        <div className={`cellWithStatus ${params.row.state.}`}>
          {params.row.state}
        </div>
      );
    },
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
