import "./lodgeInfo.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axiosInstance.js"
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Calendar from "../../components/calendar/calendar.jsx";

export default function LodgeInfo() {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [newService, setNewService] = useState('');
  const [open, setOpen] = useState(false);
  const [newPhotos, setNewPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLodgeData = async () => {
      try {
        const res = await axiosInstance.get(`/lodges/${id}`);
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

   const handlePhotoChange = (e) => {
    setNewPhotos([...newPhotos, e.target.files[0]]);
  };

  const handleAddPhoto = async () => {
    try {
      const formData = new FormData();
      newPhotos.forEach((photo) => formData.append("photos", photo));
  
      const res = await axiosInstance.post(`/lodges/upload/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const updatedPhotos = res.data.updatedLodge.photos;
  
      setFormData((prevData) => ({
        ...prevData,
        photos: updatedPhotos,
      }));
      setNewPhotos([]);
    } catch (err) {
      console.error("Error uploading photo:", err);
    }
  };

  const handleDeletePhoto = async (photo) => {
  try {
    const res = await axiosInstance.put(`/lodges/delete-photo/${id}`, { photo });
    const updatedPhotos = res.data.updatedPhotos;

    setFormData((prevData) => ({
      ...prevData,
      photos: updatedPhotos,
    }));
  } catch (err) {
    console.error("Error deleting photo:", err);
  }
};

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/lodges/${id}`, formData);
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
               <div className="lodgeImagesScroll">
                 {formData.photos?.map((photo, i) => (
                   <div className="lodgeImgWrapper" key={i}>
                     <img
                       src={`https://creek-project.onrender.com/${photo}`}
                       alt="Imagen de la cabaña"
                       className="lodgeImg"
                     />
                   </div>
                 ))}
               </div>
            )}
            <div className="lodgeWrapper">
              <div className="lodgeName">
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
              </div>
              <div className="lodgeImagesScroll">
               {formData.photos?.map((photo, i) => (
                <div className="lodgeImgWrapper" key={i}>
                  <img
                    src={`https://creek-project.onrender.com/${photo}`}
                    alt="Imagen de la cabaña"
                    className="lodgeImg"
                  />
                  {editing && (
                    <button
                      onClick={() => handleDeletePhoto(photo)}
                      className="deletePhotoButton"
                      title="Eliminar imagen"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
             </div>
              {editing && (
                
                <div className="addPhoto">
                  <button
                      onClick={() => handleDeletePhoto(photo)}
                      className="deletePhotoButton"
                      title="Eliminar imagen"
                    >
                      🗑️
                    </button>
                      onClick={() => handleDeletePhoto(photo)}
                      className="deletePhotoButton"
                      title="Eliminar imagen"
                    >
                      🗑️
                    </button>
                  <input type="file" onChange={handlePhotoChange} className="editInput" />
                  <button onClick={handleAddPhoto} className="editButton">+</button>
                </div>
              )}
              <div className="lodgeDetails">
                <div className="lodgeDetailsTexts">
                  <h1 className="lodgeMinititle">Detalles</h1>
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
                  <h1 className="lodgeMinititle">Capacidad</h1>
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
              <div className="calendarContainer">
                <h2>Calendario de disponibilidad</h2>
                <Calendar lodgeId={id} readOnly={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
