import "./roomInfoPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import useFetch from "../hooks/useFetch.js";
import { API_URL } from "../config.js";
import { UserContext } from "../context/UserContext";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { SearchContext } from "../context/SearchContext";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
};

export default function RoomInfoPage() {
  const location = useLocation();
  const [options, setOptions] = useState(location.state?.options || { adult: 1, children: 0 });
  const { dates } = useContext(SearchContext);
    const storedDates = JSON.parse(localStorage.getItem("searchDates"));
const parsedDates = storedDates
  ? [{
      startDate: new Date(storedDates[0].startDate),
      endDate: new Date(storedDates[0].endDate),
      key: "selection"
    }]
  : [{
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    }];

//dates del contexto arranca como [] (truthy), por eso se chequea el largo
const [localDates, setLocalDates] = useState(location.state?.dates || (dates?.length ? dates : parsedDates));
  const [openDate, setOpenDate] = useState(false);
  const id = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [openOptions, setOpenOptions] = useState(false);
  const { data } = useFetch(`/lodges/${id}`);
  const [price, setPrice] = useState({ priceAdult: 0, priceChild: 0 });
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    console.log("user", user)
    const fetchPrice = async () => {
      try {
        const response = await axios.get("/prices/last/cabañas");
        const latestPrice = response.data
        setPrice(latestPrice);
      } catch (error) {
        console.error("Error fetching price:", error);
      }
    };

    const fetchOccupiedDates = async () => {
      try {
        const response = await axios.get(`/lodges/occupied-dates/${id}`);
        setOccupiedDates(response.data.occupiedDates);
      } catch (error) {
        console.error("Error obteniendo fechas ocupadas:", error);
      }
    };

    fetchOccupiedDates();
    fetchPrice();
  }, []);

  async function bookThisLodge() {
    if (user) {
      const checkIn = format(new Date(localDates[0].startDate), 'yyyy-MM-dd');
      const checkOut = format(new Date(localDates[0].endDate), 'yyyy-MM-dd');
      if (checkOut <= checkIn) {
        alert("La fecha de salida debe ser posterior a la de ingreso.");
        return;
      }
      try {

        setIsLoading(true);

        const sendEmailFlag = true;
        await axios.post('/bookings/createBooking', {
          lodge: id,
          checkIn,
          checkOut,
          user: user._id,
          numberOfAdults: options.adult,
          numberOfChildren: options.children,
          totalAmount: totalPrice,
          sendEmail:  sendEmailFlag,
          origin: "cliente", 
        });

        //la reserva ya quedo hecha: si falla el aviso al admin no se le muestra error al cliente
        await axios.post(`/notifications/`, {
          type: "Nueva reserva",
          cabain: id,
          client: user._id,
          date: Date.now()
        }).catch((err) => console.error("Error creando notificación:", err));

        setIsLoading(false);
        alert('Cabaña reservada exitosamente');
        navigate("/account/bookings");
      } catch (error) {
      setIsLoading(false); 

      if (error.response && error.response.status === 409) {
        alert("La cabaña ya está ocupada en esas fechas.\nPor favor, elegí un rango diferente.");
      } else {
        alert("Ocurrió un error inesperado al reservar. Inténtalo nuevamente.");
      }

      console.error("Axios error:", error);
    }
    } else {
      navigate('/login');
    }
  }

  const formattedStartDate = localDates.length > 0 ? format(localDates[0].startDate, "dd/MM/yyyy") : "";
  const formattedEndDate = localDates.length > 0 ? format(localDates[0].endDate, "dd/MM/yyyy") : "";

  const nights =
  localDates && localDates[0]?.startDate && localDates[0]?.endDate
    ? Math.max(
        1,
        Math.ceil(
          (localDates[0].endDate - localDates[0].startDate) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 1;


  const isAvailable = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return !occupiedDates.includes(formattedDate);
  };

  const handleOption = (name, operation) => {
    const maxCapacity = data.capacity;
    let newAdultCount = options.adult;
    let newChildrenCount = options.children;

    if (name === "adult") {
      newAdultCount = operation === "i" ? options.adult + 1 : options.adult - 1;
    } else if (name === "children") {
      newChildrenCount = operation === "i" ? options.children + 1 : options.children - 1;
    }

    if (newAdultCount + newChildrenCount > maxCapacity) {
      return;
    }
    setOptions({
      adult: newAdultCount,
      children: newChildrenCount,
    });
  };

  const serviceIcons = {
    Wifi: "📶",
    pileta: "🏊",
    Televisión: "📺"
  };
  
  const handleDateChange = (item) => {
    const newDates = [item.selection];
    setLocalDates(newDates);
    console.log("newDates", newDates)
    localStorage.setItem("searchDates", JSON.stringify(newDates));
  };
  
  const renderServices = (services) => {
    if (!services) return null;
    return services.split(", ").map((service, index) => (
      <div key={index} className="serviceTag">
        {serviceIcons[service] || "🔧"} {service}
      </div>
    ));
  };

const totalPricePerNight = (options.adult * price.priceAdult) + (options.children * price.priceChild);
const totalPrice = totalPricePerNight * nights;

  return (
    <div className="roomInfoContainer">
      <div className="lodgeContainer">
        <div className="lodgeWrapper">
          <h1 className="lodgeTitle">{data.name}</h1>
           <div className="lodgeImages">
            {data.photos?.length > 1 ? (
              <Slider {...sliderSettings}>
                {data.photos.map((photo, i) => (
                  <div key={i}>
                    <img
                      src={`${API_URL}/${photo}`}
                      alt={`Foto ${i}`}
                      className="lodgeImg"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <img
                src={data.photos?.[0] ? `${API_URL}/${data.photos[0]}` : "/images/logoCamping.png"}
                alt="Foto única"
                className="lodgeImg"
              />
            )}
          </div>
          <div className="lodgeDetails">
            <div className="lodgeDetailsTexts">
              <h2 className="lodgeMinititle">Detalles</h2>
              <p className="lodgeDesc">{data.description}</p>

              <div className="lodgeAmenities">
                <h2 >Servicios</h2>
                <div className="amenitiesList">
                  {renderServices(data.services)}
                </div>
              </div>

              <div className="lodgeImportantInfo">
                <h3>Información importante</h3>
                <div className="importantInfoCard">
                  <h4>Normas de la casa</h4>
                  <p>Check-in a partir de las 10:00 AM</p>
                  <p>Se permiten mascotas</p>
                  <p>Se ofrece desayuno gratuito a partir de las 8:30 a 11:30 AM</p>
                  <p>Acceso gratuito a la pileta</p>
                </div>
                <div className="importantInfoCard">
                  <h4>Cancelación</h4>
                  <p>Cancelacion gratuita hasta 3 dias antes de la fecha de Check-In.</p>
                </div>
              </div>
            </div>

         <div className="lodgeDetailsPrice">
           <h2>Fechas de reserva</h2>
           <div className="dateSetter">
             <span onClick={() => setOpenDate(!openDate)} className="roomsSearchText">
               {`${formattedStartDate} to ${formattedEndDate}`}
             </span>
             {openDate && (
               <DateRange
               editableDateInputs={true}
               onChange={handleDateChange}
               moveRangeOnFirstSelection={false}
               ranges={localDates}
               className="dates"
               minDate={new Date()}
               disabledDay={(date) => !isAvailable(date)}
             />
             
             )}
           </div>
           <h2>Cantidad de personas</h2>
           <div className="peopleSetter">
             <span onClick={() => setOpenOptions(!openOptions)} className="roomsSearchText">
               {`${options.adult} Adultos - ${options.children} Niños`}
             </span>
             {openOptions && (
               <div className="optionsPeople">
                    <div className="optionItem">
                      <span className="optionText">Adultos</span>
                      <div className="optionCounter">
                        <button disabled={options.adult <= 1} className="optionCounterButton" onClick={() => handleOption("adult", "d")} >  - </button>
                        <span className="optionCounterNumber">{options.adult}</span>
                        <button className="optionCounterButton" onClick={() => handleOption("adult", "i")} >   + </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Niños</span>
                      <div className="optionCounter">
                        <button disabled={options.children <= 0} className="optionCounterButton" onClick={() => handleOption("children", "d")} > - </button>
                        <span className="optionCounterNumber">{options.children}</span>
                        <button  className="optionCounterButton" onClick={() => handleOption("children", "i")}> +  </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="priceDetailContainer">
               <h2>Detalle de precio</h2>
               <div className="priceRow">
                 <span>Precio por adulto:</span>
                 <span>${price.priceAdult}</span>
               </div>
               <div className="priceRow">
                 <span>Precio por niño:</span>
                 <span>${price.priceChild}</span>
               </div>
               <div className="priceRow">
                 <span>Cantidad de días:</span>
                 <span>{nights}</span>
               </div>
               <hr />
               <div className="priceRow total">
                 <span>Total a pagar:</span>
                 <span><strong>${totalPrice}</strong></span>
               </div>
               </div>
               <button onClick={bookThisLodge} className="bookNowButton" disabled={isLoading} > 
               {isLoading ? "Reservando..." : "Reserva ahora!"}</button>           
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
