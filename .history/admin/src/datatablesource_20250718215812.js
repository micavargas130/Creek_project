export const userColumns = [
 {
  field: "checkIn",
  headerName: "Fecha ingreso",
  width: 150,
  valueGetter: (params) => {
    const date = new Date(params.row.checkIn);
    return date.toLocaleDateString("es-AR"); 
  },
},
  {
    field: "checkOut",
    headerName: "Check-Out",
    width: 130,
    renderCell: (params) => {
      const date = new Date(params.row.checkOut.slice(0, 10).split("-").join("/"));
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