import "./roomInfoPage.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import useFetch from "../hooks/useFetch.js";
import { useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { isBefore, startOfDay } from 'date-fns';

export default function RoomInfoPage() {
  const location = useLocation();
  const [options, setOptions] = useState(location.state.options);
  const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [openOptions, setOpenOptions] = useState(false);

  const { data } = useFetch(`/lodges/${id}`);

  async function bookThisLodge() {
    if (user) {
      try {
        await axios.post('/bookings/createBooking', {
          place: id,
          placeName: data.name,
          checkIn: format(dates[0].startDate.getTime(), 'yyyy-MM-dd'),
          checkOut: format(dates[0].endDate.getTime(), 'yyyy-MM-dd'),
          user: user._id,
          name: user.first_name,
          numberOfGuests: options.adult + options.children,
          totalAmount: options.adult * 15000 + options.children * 10000,
        });

        await axios.put(`/lodges/availability/${data._id}`, { dates: alldates });
        await axios.post(`/notifications/`, {
          type: "Nueva reserva",
          cabain: id,
          client: user._id,
        });

        alert('Cabaña reservada exitosamente');
        navigate('/account/bookings');
      } catch (error) {
        console.error('Axios error:', error);
      }
    } else {
      navigate('/login');
    }
  }

  const getDatesInRange = (start, end) => {
    const date = new Date(start.getTime());
    let list = [];
    while (date <= end) {
      list.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return list;
  }

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (date) => {
    const timestamp = date.getTime();
    return !data.unavailableDates.some((unavailableDate) =>
      timestamp >= new Date(unavailableDate).getTime() &&
      timestamp <= new Date(unavailableDate).getTime()
    );
  };

  const isDateBeforeToday = (date) => {
    const today = startOfDay(new Date());
    return isBefore(date, today);
  };

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
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
    setOptions((prev) => ({
      ...prev,
      adult: newAdultCount,
      children: newChildrenCount,
    }));
  };

  // Helper function to map services to icons
  const serviceIcons = {
    Wifi: "📶",
    pileta: "🏊",
    Televisión:"📺"
  };

  const renderServices = (services) => {
    return services.split(", ").map((service, index) => (
      <div key={index} className="serviceTag">
        {serviceIcons[service] || "🔧"} {service}
      </div>
    ));
  };

  return (
    <div className="roomInfoContainer">
      <div className="lodgeContainer">
        {open && (
          <div className="slider">
            <div className="sliderWrapper">
              <img src={data.photos[slideNumber].src} alt="" className="sliderImg" />
            </div>
          </div>
        )}
        <div className="lodgeWrapper">
          <h1 className="lodgeTitle">{data.name}</h1>
          <div className="lodgeImages">
            {data.photos?.map((photo, i) => (
              <div className="lodgeImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo}
                  alt=""
                  className="lodgeImg"
                />
              </div>
            ))}
          </div>
          <div className="lodgeDetails">
            <div className="lodgeDetailsTexts">
              <h1 className="lodgeMinititle">Details</h1>
              <p className="lodgeDesc">{data.description}</p>
              <div className="lodgeAmenities">
                <h1>Amenities</h>
                <div className="amenitiesList">
                  {renderServices(data.services)}
                </div>
              </div>
              <div className="lodgeImportantInfo">
                <h2>Información importante</h2>
                <div className="importantInfoCard">
                  <h3>Normas de la casa</h3>
                  <p>Check-in a partir de las 15:00</p>
                  <p>5 huéspedes como máximo</p>
                  <p>Check-in autónomo con caja de seguridad para llaves</p>
                </div>
                <div className="importantInfoCard">
                  <h3>Sobre la seguridad y la propiedad</h3>
                  <p>No se indicó si hay detector de monóxido de carbono</p>
                  <p>No se indicó si hay detector de humo</p>
                </div>
                <div className="importantInfoCard">
                  <h3>Política de cancelación</h3>
                  <p>Cancelación gratuita antes del 26 ene.</p>
                  <p>Consultá la política de cancelación completa del anfitrión, que se aplica incluso si cancelás por contagio o algún otro problema causado por el COVID-19.</p>
                </div>
              </div>
            </div>
            <div className="lodgeDetailsPrice">
              <h2>Dates</h2>
              <div className="dateSetter">
                <span onClick={() => setOpenDate(!openDate)} className="headerSearchText">{`${format(dates[0].startDate, "dd/MM/yyyy")} to ${format(dates[0].endDate, "dd/MM/yyyy")}`}</span>
                {openDate && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDates([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dates}
                    disabledDay={(date) => (isDateBeforeToday(date) || !isAvailable(date))}
                    className="roomDate"
                  />
                )}
              </div>
              <h2>People</h2>
              <div className="peopleSetter">
                <span onClick={() => setOpenOptions(!openOptions)} className="headerSearchText">{`${options.adult} adult - ${options.children} children`}</span>
                {openOptions && (
                  <div className="optionsPeople">
                    <div className="optionItem">
                      <span className="optionText">Adult</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.adult <= 1}
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">{options.adult}</span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("adult", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="optionItem">
                      <span className="optionText">Children</span>
                      <div className="optionCounter">
                        <button
                          disabled={options.children <= 0}
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "d")}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">{options.children}</span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <b>Price: {options.adult * 15000 + options.children * 10000} per night</b>
              <button onClick={bookThisLodge} className="bookNowButton">Reserve or Book Now!</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
