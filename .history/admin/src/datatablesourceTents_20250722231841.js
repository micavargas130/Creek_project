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

 valueGetter: (params) => {
  const date = params.row.checkIn;
  return date.slice(0, 10).split("-").reverse().join("/"); // "22/07/2025"
}

  {
    field: "checkOuy",
    headerName: "Check-Out",
    width: 90,
    valueGetter: (params) => {
      const date = new Date(params.row.checkOut);
      return date.toLocaleDateString("es-US");
      
    },
  },
 

];
