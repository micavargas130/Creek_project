export const userColumns = [
  {
    field: "checkIn",
    headerName: "Check-In",
    width: 180,
    renderCell: (params) => {
      const date = new Date(params.row.checkIn);
      return date.toLocaleDateString("es-US");
      
    },
  },
  {
    field: "checkOut",
    headerName: "Check-Out",
    width: 1,
    renderCell: (params) => {
      const date = new Date(params.row.checkOut);
      return date.toLocaleDateString("es-US");
      
    },
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