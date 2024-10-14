const newTent = async (ev) => {
  ev.preventDefault();

  if (!location) {
    alert("Debes seleccionar una posición en el mapa antes de enviar el formulario");
    return;
  }

  const fechaError = validarFechas(checkIn, checkOut);
  if (fechaError) {
    alert(fechaError);
    return;
  }

  const { row, col } = location;

  try {
    const tentResponse = await axios.post("http://localhost:3000/tents", {
      first_name,
      last_name,
      dni,
      email,
      phone,
      ocupation,
      checkIn,
      checkOut,
      numberOfAdults,
      numberOfChildren,
      location: { row, col },
    });

    const totalAmount = (numberOfAdults * price.priceAdult) + (numberOfChildren * price.priceChild);
    const tentId = tentResponse.data._id;

    const paymentData = {
      amount: totalAmount,
      type: "Ingreso",
      date: new Date().toISOString(),
      user: `${first_name} ${last_name}`,
      tent: tentId,
      comment: "Carpa",
      status: modalState.selectedStatus.toLowerCase(),
    };

    await axios.post("http://localhost:3000/accounting/createAccounting", paymentData);

    //alert("Registro exitoso");
   // setRedirect(true);
  } catch (err) {
    alert("Error al registrar la carpa");
  } finally {
    // Aquí actualizamos correctamente el estado del modal
    setModalState((prevState) => ({
      ...prevState,
      visible: true,
    }));
  }
};
