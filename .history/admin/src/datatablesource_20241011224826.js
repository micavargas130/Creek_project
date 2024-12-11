export const userColumns = [
  {
    field: "checkIn",
    headerName: "Check In",
    width: 120,
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