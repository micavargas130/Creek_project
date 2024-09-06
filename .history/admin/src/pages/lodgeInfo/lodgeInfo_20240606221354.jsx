
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";

import { DateRange } from "react-date-range";
import { format } from "date-fns";


export default function LodgeInfo() {
  const location = useLocation();

  const id = location.pathname.split("/")[2];
  const [options, setOptions] = useState(location.state?.options || { adult: 1, children: 0 });
  const [data, setData] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    const fetchLodgeData = async () => {
      try {
        const res = await axios.get(`/lodges/${id}`);
        setData(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching lodge data:", err);
      }
    };
    fetchLodgeData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/lodges/${id}`, formData);
      setData(formData);
      setEditing(false);
    } catch (err) {
      console.error("Error updating lodge data:", err);
    }
  };


  const renderServices = (services) => {
    if (!services) return null;
    return services.split(", ").map((service, index) => (
      <div key={index} className="serviceTag">
        {service} {/* Icon could be added here if desired */}
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
                <h2>Amenities</h2>
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
    <span onClick={() => setOpenDate(!openDate)} className="headerSearchText">
      {`${formattedStartDate} to ${formattedEndDate}`}
    </span>
    {openDate && (
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setLocalDates([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={localDates}
                    className="dates"
                    minDate={new Date()}
                    disabledDay={(date) => !isAvailable(date)}    
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
