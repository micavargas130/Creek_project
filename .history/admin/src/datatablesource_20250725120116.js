export const userColumns = [
  {
  field: "checkIn",
  headerName: "Fecha ingreso",
  width: 150,
  valueGetter: (params) => {
     const date = params.row.checkIn;
     return date.slice(0, 10).split("-").reverse().join("/");
    }
  },
  {
    field: "checkOut",
    headerName: "Check-Out",
    width: 90,
    valueGetter: (params) => {
      const date = params.row.checkOut
      return date.slice(0, 10).split("-").reverse().join("/");      
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