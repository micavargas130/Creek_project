/* eslint-disable react-hooks/rules-of-hooks */
import "./roomInfoPage.css";
import {useNavigate} from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import useFetch from "../hooks/useFetch.js";
import { useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { isBefore, startOfDay } from 'date-fns';





export default function roomInfoPage(){

  const location = useLocation();
  const [options, setOptions] = useState(location.state.options);
  const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const {user} = useContext(UserContext)
  const [openOptions, setOpenOptions] = useState(false);


  const {data} = useFetch(`/lodges/${id}`)


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

        console.log(alldates)
        await axios.put(`/lodges/availability/${data._id}`, {dates:alldates});
        await axios.post


       alert('Cabaña reservada exitosamente')
       navigate('/account/bookings')
  
      } catch (error) {
  
        console.error('Axios error:', error);
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      }
    } else {
      navigate('/login');
    }
  }

  const getDatesInRange = (start,end) =>{
    const date = new Date(start.getTime());
    let list = []
    while(date <= end){

      list.push(new Date(date).getTime())
      date.setDate(date.getDate()+1)

    }
    return list
  }
  
  

  const alldates= getDatesInRange(dates[0].startDate, dates[0].endDate)
  
  const isAvailable = (date) => {
    const timestamp = date.getTime();
    return !data.unavailableDates.some((unavailableDate) =>
      timestamp >= new Date(unavailableDate).getTime() &&
      timestamp <= new Date(unavailableDate).getTime()
    );
  };


  const isDateBeforeToday = (date) => {
    // Obtén la fecha actual sin horas, minutos y segundos para hacer una comparación precisa.
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
      // Si excede, no actualiza las opciones
      // Puedes mostrar un mensaje de error aquí si deseas
      return;
    }
    setOptions((prev) => {
      return {
        ...prev,
        adult: newAdultCount,
        children: newChildrenCount,
      };
    });
  };


  return (
    <div>
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
              <p className="lodgeDesc">
                {data.description}
              </p>
            </div>
            <div className="lodgeDetailsPrice">
              <h2>Dates</h2>
              <div className="dateSetter">
              <span onClick={() =>setOpenDate(!openDate)} className="headerSearchText">{`${format(dates[0].startDate, "dd/MM/yyyy")} to ${format(dates[0].endDate, "dd/MM/yyyy")}`}</span>
              {openDate && <DateRange
                editableDateInputs={true}
                onChange={(item) => setDates([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dates}
                disabledDay= {(date) => (isDateBeforeToday(date) || !isAvailable(date))}
                className="roomDate"
                />}
                </div>

                <h2>People</h2>
                <div className="peopleSetter">
                  <span  onClick={() => setOpenOptions(!openOptions)} className="headerSearchText">{`${options.adult} adult - ${options.children} children`}  </span>
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
                        <span className="optionCounterNumber">
                          {options.adult}
                        </span>
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
                        <span className="optionCounterNumber">
                          {options.children}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("children", "i")}
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>)}

                  </div>
                <b>Price: {options.adult*15000 + options.children * 10000} per night</b> 
             
              <button onClick={bookThisLodge}>Reserve or Book Now!</button>
              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}