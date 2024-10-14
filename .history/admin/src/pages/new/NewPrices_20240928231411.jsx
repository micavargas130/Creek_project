import "./new.scss";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";

const New = ({ inputs, title }) => {
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchPricesData = async () => {
      try {
        const res = await axios.get(`/prices/66a82bc2ac1709160e479670`);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching price data:", err);
      }
    };
    fetchPricesData();
  }, []); // Añadir dependencia vacía para que se ejecute solo una vez

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Asegúrate de que el name sea el correcto
    }));
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleFormSubmit = async (e) => {
    try {
      await axios.put(`/lodges/66a82bc2ac1709160e479670`, formData);
      setEditing(false);
    } catch (err) {
      console.error("Error updating price data:", err);
    }
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="PriceContainer">
          <div className="lodgeContainer">
            <div className="lodgeWrapper">
              <div className="lodgeDetails">
                <div className="lodgeDetailsTexts">
                  <h1 className="lodgeMinititle">Precio Adulto</h1>
                  <p className="lodgeDesc">
                    {editing ? (
                      <input
                        type="number"
                        name="priceAdult" // Cambia el name a "priceAdult"
                        value={formData.priceAdult || ""}
                        onChange={handleInputChange}
                        className="editInput"
                      />
                    ) : (
                      formData.priceAdult
                    )}
                  </p>
                  <h1 className="lodgeMinititle">Precio Niño</h1>
                  <p className="lodgeCapacity">
                    {editing ? (
                      <input
                        type="number"
                        name="priceChild" // Cambia el name a "priceChild"
                        value={formData.priceChild || ""}
                        onChange={handleInputChange}
                        className="editInput"
                      />
                    ) : (
                      formData.priceChild
                    )}
                  </p>
                </div>
                {editing && (
                  <button className="editButton" onClick={handleFormSubmit}>
                    Save
                  </button>
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
};

export default New;
