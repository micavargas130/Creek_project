import "./lodgeInfo.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useFetch from "../../hooks/useFetch.js";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

export default function LodgeInfo() {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const [options, setOptions] = useState(location.state?.options || { adult: 1, children: 0 });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [newService, setNewService] = useState('');
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data } = useFetch(`/lodges/${id}`);

  useEffect(() => {
    const fetchLodgeData = async () => {
      try {
        const res = await axios.get(`/lodges/${id}`);
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

  const handleNewServiceChange = (e) => {
    setNewService(e.target.value);
  };

  const handleAddService = () => {
    const updatedServices = formData.services ? formData.services.split(', ') : [];
    updatedServices.push(newService);
    setFormData((prevData) => ({
      ...prevData,
      services: updatedServices.join(', '),
    }));
    setNewService('');
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/lodges/${id}`, formData);
      setEditing(false);
    } catch (err) {
      console.error("Error updating lodge data:", err);
    }
  };

  const renderServices = (services) => {
    if (!services) return null;
    return services.split(", ").map((service, index) => (
      <div key={index} className="serviceTag">
        {service}
      </div>
    ));
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="roomInfoContainer">
          <div className="lodgeContainer">
            {open && (
              <div className="slider">
              <div className="lodgeImages">
             {formData.photos?.map((photo, i) => (
                  <div className="lodgeImgWrapper" key={i}>
                     <img
                        src={`http://localhost:3001/${photo}`} // Ajusta el dominio y puerto si es necesario
                        alt="Imagen de la cabaña"
                        className="lodgeImg"
                       />
    </div>
  ))}
</div>
              </div>
            )}
            <div className="lodgeWrapper">
              <h1 className="lodgeTitle">
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="editInput"
                  />
                ) : (
                  formData.name
                )}
              </h1>
              <div className="lodgeImages">
                {formData.photos?.map((photo, i) => (
                  <div className="lodgeImgWrapper" key={i}>
                    <img
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
                    {editing ? (
                      <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        className="editInput"
                      />
                    ) : (
                      formData.description
                    )}
                  </p>
                  <h1 className="lodgeMinititle">Capacity</h1>
                  <p className="lodgeCapacity">
                    {editing ? (
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity || ''}
                        onChange={handleInputChange}
                        className="editInput"
                      />
                    ) : (
                      formData.capacity
                    )}
                  </p>
                  <div className="lodgeAmenities">
                    <h2>Amenities</h2>
                    <div className="amenitiesList">
                      {renderServices(formData.services)}
                    </div>
                    {editing && (
                      <div className="addService">
                        <input
                          type="text"
                          value={newService}
                          onChange={handleNewServiceChange}
                          placeholder="Add new service"
                          className="editInput"
                        />
                        <button onClick={handleAddService} className="editButton">Add</button>
                      </div>
                    )}
                  </div>
                </div>
                {editing && (
                  <button className="editButton" onClick={handleFormSubmit}>Save</button>
                )}
                <button className="editButton" onClick={handleEditToggle}>
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
