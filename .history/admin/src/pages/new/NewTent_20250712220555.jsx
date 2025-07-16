import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axiosInstance from "../../axios/axiosInstance.js"
import { Navigate } from "react-router-dom";
import MapComponent from "../../components/map/mapComponent.jsx";
import moment from 'moment';
import SelectPaymentStatus from "../../components/props/selectPaymentStatus.jsx";

const New = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ocupation, setOcupation] = useState("");
  const [checkIn, setCheckIn] = useState(moment().format('YYYY-MM-DD'));
  const [checkOut, setCheckOut] = useState("");
  const [numberOfAdults, setNumberOfAdults] = useState(0);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [location, setLocation] = useState(null); 
  const [redirect, setRedirect] = useState(false);
  const [occupiedPositions, setOccupiedPositions] = useState([]);
  const [lodgesInfo, setLodgesInfo] = useState([]);
  const [price, setPrice] = useState([]);  //Precio del hospedaje
  const [partialPayment, setPartialPayment] = useState([]); //Lo que paga la persona
  const [amountDays, setAmountDays] = useState([]);

  // Estado para el modal de confirmación de pago
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pagada");

  //Traigo la data
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/tents/occupiedPositions");
      const { occupiedPositions } = response.data;
      setOccupiedPositions(occupiedPositions);
  
      const lodgesResponse = await axiosInstance.get("/lodges");
      setLodgesInfo(lodgesResponse.data);
  
      // Obtener el último precio de la categoría "carpas"
      const priceResponse = await axiosInstance.get("/prices/last/carpas");
      setPrice(priceResponse.data);
      console.log("Último precio de carpas:", priceResponse.data);
    } catch (error) {
      console.error("Error al obtener datos del servidor", error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  //Click del mapa
  const handleCellClick = (row, col, iconType) => {
    if (iconType === "FestivalRoundedIcon") {
      setLocation({ row, col });
    }
  };

  //Validacion de fechas
  const validarFechas = (checkInStr, checkOutStr) => {
    const checkInDate = new Date(checkInStr);
    const checkOutDate = new Date(checkOutStr);
    const now = new Date();

    if (checkOutDate <= now) {
      return "La fecha de check-out debe ser posterior a la fecha actual.";
    }
    if (checkOutDate <= checkInDate) {
      return "La fecha de check-out debe ser posterior a la fecha de check-in.";
    }
    return null;
  };

  const amountToPay = (numberOfAdults, numberOfChildren, priceAdult, priceChild, days) => {
    return (numberOfAdults * priceAdult + numberOfChildren * priceChild) * days;
  };

  const totalToPay = amountToPay(numberOfAdults, numberOfChildren, price.priceAdult, price.priceChild, amountDays);

  const handleDateChange = (checkOut) => {
    // Calculate days difference
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const daysDifference = Math.round((checkOutDate - checkInDate) / (1000 * 3600 * 24));
  
    // Update state with total price and days
    setAmountDays(daysDifference);
  };

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
    handleDateChange(checkOut);

    // Abrir el modal para seleccionar el estado del pago
    setModalVisible(true);
  };

  const confirmFinishClick = async () => {
    const { row, col } = location;
    try {
        const tentResponse = await axiosInstance.post("/tents", {
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
        const tentId = tentResponse.data._id;
        const totalAmount = tentResponse.data.totalAmount; // Ahora lo obtenemos desde la API

        let payment = 0;

        // Determinar el valor de payment según el estado seleccionado
        if (selectedStatus === "pagada") {
            payment = totalAmount; // Pago completo
        } else if (selectedStatus === "parcial") {
            payment = partialPayment; // Pago parcial ingresado por el usuario
        }

        const paymentData = {
            amount: 0,
            totalAmount, // lo que debe pagar (ahora viene del backend)
            type: "Ingreso",
            date: new Date().toISOString(),
            tent: tentId,
            remainingAmount: totalAmount,
            status: selectedStatus.toLowerCase(),
        };
        console.log(paymentData)

        const { data: accountingData } = await axiosInstance.post(`/accounting/createAccounting`, paymentData); 

        // Ahora, crea un pago en el historial de pagos
        const paymentHistoryData = {
          accounting: accountingData._id, // ID del accounting recién creado
          amount: payment, // Monto del pago inicial
          status: selectedStatus.toLowerCase(), // Estado del pago
        };
  
        // Guarda el pago en el historial
        await axiosInstance.post(`/accounting/pay/${accountingData._id}`, paymentHistoryData); 
        alert("Registro exitoso");
        setRedirect(true);
    } catch (err) {
        alert("Error al registrar la carpa");
    } finally {
        setModalVisible(false);
    }
};

  if (redirect) {
    return <Navigate to={"/tents"} />;
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Añadir una nueva carpa ocupada</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <MapComponent onCellClick={handleCellClick} occupiedPositions={occupiedPositions} lodgesInfo={lodgesInfo} />
          </div>
          <div className="right">
            <form onSubmit={newTent}>
            <div className="mb-64">
                  <div>
                    <div>
                      Nombre{" "}
                      <input type="text" placeholder="Nombre" value={first_name} onChange={(ev) => setFirstName(ev.target.value)}
 />
                      Apellido{" "}
                      <input
                        type="text"
                        placeholder="Apellido"
                        value={last_name}
                        onChange={(ev) => setLastName(ev.target.value)}
                      />
                      DNI
                      <input
                        type="number"
                        id="dni"
                        placeholder="Ingrese su DNI"
                        value={dni || ""}
                        onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 8) {
                          setDni(value);
                        } else {
                          alert("El DNI no puede tener más de 8 números.");
                         }
                        }}
                           />
                      Email
                      <input
                        type="email"
                        placeholder={"Email"}
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                      />
                      Telefono
                      <input
                        type="text"
                        placeholder="Telefono"
                        value={phone}
                        onChange={(ev) => setPhone(ev.target.value)}
                      />
                      Ocupación
                      <input
                        type={"text"}
                        placeholder="Ocupación"
                        value={ocupation}
                        onChange={(ev) => setOcupation(ev.target.value)}
                      />
                    </div>
                    <div>
                      Check-In
                      <input
                        type="date"
                        placeholder="check-in"
                        value={checkIn}
                        onChange={(ev) => setCheckIn(ev.target.value)} /
                        disabled
                       />
                      Check-Out
                      <input
                        type={"date"}
                        placeholder="check-out"
                        value={checkOut}
                        onChange={(ev) => setCheckOut(ev.target.value)}
                      />
                     Cantidad de adultos
                      <input
                        type="number"
                        placeholder="Cantidad de adultos"
                        value={numberOfAdults}
                        onChange={(ev) => {
                          const newAdults = Number(ev.target.value);
                          if (newAdults + Number(numberOfChildren) <= 4) {
                            setNumberOfAdults(newAdults);
                          } else {
                            alert("No puedes hospedar más de 4 personas en una carpa.");
                          }
                        }}
                      />
                      
                      Cantidad de niños
                      <input
                        type="number"
                        placeholder="Cantidad de niños"
                        value={numberOfChildren}
                        onChange={(ev) => {
                          const newChildren = Number(ev.target.value);
                          if (Number(numberOfAdults) + newChildren <= 4) {
                            setNumberOfChildren(newChildren);
                          } else {
                            alert("No puedes hospedar más de 4 personas en una carpa.");
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              <button type="submit">Registrar</button>
            </form>
          </div>
        </div>
      </div>
      {modalVisible && (
        <SelectPaymentStatus
          amountToPay={totalToPay}
          selectedStatus={selectedStatus}
          partialPayment={partialPayment}
          setSelectedStatus={setSelectedStatus}
          setPartialPayment={setPartialPayment}
          onConfirm={confirmFinishClick}
          onCancel={() => setModalVisible(false)}
        />
        )}
    </div>
  );
};

export default New;
