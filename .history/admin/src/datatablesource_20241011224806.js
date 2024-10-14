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
  // Columna personalizada para el estado
  {
    field: "status",
    headerName: "Estado",
    width: 130,
    valueGetter: (params) => {
      // Devuelve el estado (status) si existe, de lo contrario muestra "N/A"
      return params.row.state?.status || "N/A";
    },
    filterable: true,  // Habilita el filtrado en esta columna
  },
];
