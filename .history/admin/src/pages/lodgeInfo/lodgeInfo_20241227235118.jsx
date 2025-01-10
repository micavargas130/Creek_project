import "./lodgeInfo.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

export default function LodgeInfo() {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

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

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="roomInfoContainer">
          <div className="lodgeContainer">
            <div className="lodgeWrapper">
              <h1 className="lodgeTitle">{formData.name || "Loading..."}</h1>
              <div className="lodgeDetails">
                <h1 className="lodgeMinititle">Details</h1>
                <p>{formData.description || "No details available."}</p>
                <h1 className="lodgeMinititle">Capacity</h1>
                <p>{formData.capacity || "Not specified"}</p>
                <button className="editButton" onClick={handleEditToggle}>
                  {editing ? "Cancel" : "Edit"}
                </button>
                {/* Mapa incrustado */}
                {formData.location && (
                  <div className="mapContainer" style={{ marginTop: "20px" }}>
                    <h2>Location</h2>
                    <iframe
                      title="Lodge Location"
                      src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${formData.location.lat},${formData.location.lng}`}
                      width="100%"
                      height="400"
                      style={{ border: "0" }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
npm install @fullcalendar/react @fullcalendar/daygrid
