export const userColumns = [
  {
    field: "checkIn",
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
    field: "checkOut",
    headerName: "Check Out",
    width: 120,
  },
  {
    field: "totalAmount",
    headerName: "Precio",
    width: 80,
  },
  {
    field: "totalPeople",
    headerName: "Total People",
    width: 100,
    valueGetter: (params) => {
      return params.row.numberOfAdults + params.row.numberOfChildren;
    },
  },
];