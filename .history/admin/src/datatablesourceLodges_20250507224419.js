export const userColumns = [
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
      return params.row.status || "desocupada";
    },
    renderCell: (params) => {
      const status = params.value;
      return (
        <div className={`cellWithStatus ${status}`}>
          {status}
        </div>
      );
    },
    filterable: true,
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
