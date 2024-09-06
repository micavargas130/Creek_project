import "./roomInfoPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { SearchContext } from "../context/SearchContext";

export default function() {
  const location = useLocation();
  const { dates } = useContext(SearchContext);
  const id = location.pathname.split("/")[2];
  const [options, setOptions] = useState(location.state?.options || { adult: 1, children: 0 });
  const [localDates, setLocalDates] = useState(dates);
  const [data, setData] = useState({});
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

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

  const formattedStartDate = localDates.length > 0 ? format(localDates[0].startDate, "dd/MM/yyyy") : "";
  const formattedEndDate = localDates.length > 0 ? format(localDates[0].endDate, "dd/MM/yyyy") : "";

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
        <div className="lodgeWrapper">
          <h1 className="lodgeTitle">{data.name}</h1>
          <div className="lodgeImages">
            {data.photos?.map((photo, i) => (
              <div className="lodgeImgWrapper" key={i}>
                <img src={photo} alt="" className="lodgeImg" />
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
          {editing ? (
            <form className="editLodgeForm" onSubmit={handleFormSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Capacity:</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Services:</label>
                <input
                  type="text"
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Number of Guests:</label>
                <input
                  type="text"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={handleEditToggle}>Cancel</button>
            </form>
          ) : (
            <button onClick={handleEditToggle}>Edit Lodge Info</button>
          )}
        </div>
      </div>
    </div>
  );
}
