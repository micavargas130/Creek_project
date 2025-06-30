export const userColumns = [
  {
    field: "checkIn",
    headerName: "Check-In",
    width: 130,
    renderCell: (params) => {
      const date = params.row.checkIn.slice(0, 10).split("-").reverse().join("/")
      return date.toLocaleDateString("es-US");
      
    },
  },
  {
    field: "checkOut",
    headerName: "Check-Out",
    width: 130,
    renderCell: (params) => {
      const date = {entity.checkIn.slice(0, 10).split("-").reverse().join("/")}
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