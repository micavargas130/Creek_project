export const userColumns = [
  
  {
    field: "first_name",
    headerName: "Nombre",
    width: 80,
  },

  {
    field: "last_name",
    headerName: "Apellido",
    width: 80,
  },

  {
    field: "dni",
    headerName: "DNI",
    width: 80,
  },

  {
    field: "phone",
    headerName: "Telefono",
    width: 100,
  },
  {
    field: "email",
    headerName: "Email",
    width: 125,
  },
  {
    field: "numberOfAdults",
    headerName: "Adultos",
    width: 70,
  },
  {
    field: "numberOfChildren",
    headerName: "Niños",
    width: 55,
  },

  {
    field: "checkIn",
    headerName: "Check-In",
    width: 0,
    renderCell: (params) => {
      const date = new Date(params.row.checkIn);
      return date.toLocaleDateString("es-US");
      
    },
  },

  {
    field: "checkIn",
    headerName: "Check-In",
    width: 130,
    renderCell: (params) => {
      const date = new Date(params.row.checkIn);
      return date.toLocaleDateString("es-US");
      
    },
  },
 

];
