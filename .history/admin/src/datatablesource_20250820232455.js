export const userColumns = [
  {
  field: "checkIn",
  headerName: "Check-In",
  width: 100,
  valueGetter: (params) => {
     const date = params.row.checkIn;
     return date.slice(0, 10).split("-").reverse().join("/");
    }
  },
  {
    field: "checkOut",
    headerName: "Check-Out",
    width: 100,
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
    headerName: "",
    width: 100,
    valueGetter: (params) => {
      return params.row.numberOfAdults + params.row.numberOfChildren;
    },
  },
];