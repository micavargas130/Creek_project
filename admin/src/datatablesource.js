export const userColumns = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "placeName",
    headerName: "Cabaña",
    width: 150,
  },

  {
    field: "name",
    headerName: "Nombre",
    width: 100,
  },

  {
    field: "checkIn",
    headerName: "Check In",
    width: 100,
  },
  {
    field: "checkOut",
    headerName: "Check Out",
    width: 100,
  },

  {
    field: "numberOfGuests",
    headerName: "Hospedados",
    width: 100,
  },

  {
    field: "totalAmount",
    headerName: "Precio",
    width: 100,
  },
  {
    field: "status",
    headerName: "Estado",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];
