export const userColumns = [
  
  {
    field: "first_name",
    headerName: "Nombre",
    width: 100,
  },

  {
    field: "last_name",
    headerName: "Apellido",
    width: 100,
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
    field: "checkOut",
    headerName: "Check-Out",
    width: 130,
    valueGetter: (params) => {
    const date = new Date(params.row.check);
    return date.toLocaleDateString("es-AR");
      
    },
  },

  {
    field: "checkOuy",
    headerName: "Check-Out",
    width: 90,
    renderCell: (params) => {
      const date = new Date(params.row.checkOut);
      return date.toLocaleDateString("es-US");
      
    },
  },
 

];
