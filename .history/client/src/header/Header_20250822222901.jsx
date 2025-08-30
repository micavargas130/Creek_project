import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import "./Header.css";
import { SearchContext } from "../context/SearchContext";

export default function Header() {
  const { user } = useContext(UserContext);
  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
  });

  const { dispatch } = useContext(SearchContext);
  const navigate = useNavigate();

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const handleClick = () => {
    
      dispatch({ type: "NEW_SEARCH", payload: { dates, options } });
      navigate("/",  { state: { dates, options } }); // Navega a una ruta temporal.
      setTimeout(() => navigate("/roomsPage", { state: { dates, options } }), 0); // Vuelve rápido.
  
}

  return (
    <header className="header">
      <Link to="/" className="headerIcon flex items-center gap-2">
        <img 
          src="images/logoCamping.png" 
          alt="Camping Arroyito" 
          className="h-20 w-auto"
        />
        <span className="hidden sm:inline font-semibold text-lg">Camping Arroyito</span>
      </Link>
      <div className="headerSearch"> Reservá ahora: 
        <div className="headerSearchItem">
          <span onClick={() => setOpenDate(!openDate)} className="headerSearchText">
            {`${format(dates[0].startDate, "dd/MM/yyyy")} a ${format(dates[0].endDate, "dd/MM/yyyy")}`}
          </span>
          {openDate && (
            <DateRange
             editableDateInputs={true}
             onChange={(item) => setDates([item.selection])}
             moveRangeOnFirstSelection={false}
             ranges={dates}
             className="date"
             minDate={new Date()} // Bloquea fechas anteriores a hoy
            />
          )}
        </div>

        <div className="headerSearchItem">
          <span onClick={() => setOpenOptions(!openOptions)} className="headerSearchText">
            {`${options.adult} Adultos - ${options.children} Niños`}
          </span>
          {openOptions && (
            <div className="options">
              <div className="optionItem">
                <span className="optionText">Adultos</span>
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
                <span className="optionText">Niños</span>
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
        <button className="bg-primary text-white p-3 rounded-full" onClick={handleClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
      </div>
      <Link to={user ? '/account' : '/login'} className="login">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <div className="user-info">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
          {!!user && (
            <span>{user.first_name}</span>
          )}
        </div>
      </Link>
    </header>
  );
}
