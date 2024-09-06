import "./lodgeInfo.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import useFetch from "../../hooks/useFetch.js";
import { DateRange } from "react-date-range";
import { format } from "date-fns";


export default function LodgeInfo() {
  const location = useLocation();

  const id = location.pathname.split("/")[3];
  const [options, setOptions] = useState(location.state?.options || { adult: 1, children: 0 });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data } = useFetch(`/lodges/${id}`);

  useEffect(() => {
    const fetchLodgeData = async () => {
      try {
        const res = await axios.get(`/lodges/${id}`);
       // setData(res.data);
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

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/lodges/${id}`, formData);
     // setData(formData);
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
             
            </div>


          
          </div>
        </div>
      </div>
    </div>
  );
}
