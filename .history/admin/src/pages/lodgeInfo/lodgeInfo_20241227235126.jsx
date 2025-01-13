import "./lodgeInfo.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useFetch from "../../hooks/useFetch.js";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

// Importa Leaflet y React-Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function LodgeInfo() {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
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

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="roomInfoContainer">
          <div className="lodgeContainer">
            <div className="lodgeWrapper">
              <h1 className="lodgeTitle">{formData.name}</h1>
              <div className="lodgeDetails">
                <div className="lodgeDetailsTexts">
                  <h1 className="lodgeMinititle">Details</h1>
                  <p className="lodgeDesc">{formData.description}</p>
                  <h1 className="lodgeMinititle">Capacity</h1>
                  <p className="lodgeCapacity">{formData.capacity}</p>
                  <button className="editButton" onClick={handleEditToggle}>
                    {editing ? "Cancel" : "Edit"}
                  </button>
                  {editing && (
                    <button className="editButton" onClick={handleFormSubmit}>
                      Save
                    </button>
                  )}
                </div>
              </div>

              {/* Mapa interactivo debajo del botón "Edit" */}
              <div className="mapContainer">
                <h2>Ubicación</h2>
                <MapContainer
                  center={[formData?.location?.row || 0, formData?.location?.col || 0]}
                  zoom={15}
                  style={{ height: "400px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[formData?.location?.row || 0, formData?.location?.col || 0]}
                  >
                    <Popup>{formData.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
