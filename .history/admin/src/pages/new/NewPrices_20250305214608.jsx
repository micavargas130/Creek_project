import "./new.scss";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axiosInstance from "../../axios/axiosInstance.js"

const New = () => {
  const [formData, setFormData] = useState({
    cabanas: {},
    carpas: {},
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchPricesData = async () => {
      try {
        const [cabanasRes, carpasRes] = await Promise.all([
          axiosInstance.get(`/prices/66f8b88d5e41d6ee37542fca`), // Precios de cabañas
          axios.get(`/prices/66a82bc2ac1709160e479670`), // Precios de carpas
        ]);

        setFormData({
          cabanas: cabanasRes.data,
          carpas: carpasRes.data,
        });
      } catch (err) {
        console.error("Error fetching price data:", err);
      }
    };
    fetchPricesData();
  }, []);

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [type]: {
        ...prevData[type],
        [name]: value,
      },
    }));
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleFormSubmit = async () => {
    try {
      await Promise.all([
        axios.put(`/prices/66f8b88d5e41d6ee37542fca`, formData.cabanas),
        axios.put(`/prices/66a82bc2ac1709160e479670`, formData.carpas),
      ]);
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
                  {/* Precios de Cabañas */}
                  <h2 className="sectionTitle">Precios de Cabañas</h2>
                  <h1 className="lodgeMinititle">Precio Adulto</h1>
                  <p className="lodgeDesc">
                    {editing ? (
                      <input
                        type="number"
                        name="priceAdult"
                        value={formData.cabanas.priceAdult || ""}
                        onChange={(e) => handleInputChange(e, "cabanas")}
                        className="editInput"
                      />
                    ) : (
                      formData.cabanas.priceAdult
                    )}
                  </p>
                  <h1 className="lodgeMinititle">Precio Niño</h1>
                  <p className="lodgeCapacity">
                    {editing ? (
                      <input
                        type="number"
                        name="priceChild"
                        value={formData.cabanas.priceChild || ""}
                        onChange={(e) => handleInputChange(e, "cabanas")}
                        className="editInput"
                      />
                    ) : (
                      formData.cabanas.priceChild
                    )}
                  </p>

                  {/* Precios de Carpas */}
                  <h2 className="sectionTitle">Precios de Carpas</h2>
                  <h1 className="lodgeMinititle">Precio Adulto</h1>
                  <p className="lodgeDesc">
                    {editing ? (
                      <input
                        type="number"
                        name="priceAdult"
                        value={formData.carpas.priceAdult || ""}
                        onChange={(e) => handleInputChange(e, "carpas")}
                        className="editInput"
                      />
                    ) : (
                      formData.carpas.priceAdult
                    )}
                  </p>
                  <h1 className="lodgeMinititle">Precio Niño</h1>
                  <p className="lodgeCapacity">
                    {editing ? (
                      <input
                        type="number"
                        name="priceChild"
                        value={formData.carpas.priceChild || ""}
                        onChange={(e) => handleInputChange(e, "carpas")}
                        className="editInput"
                      />
                    ) : (
                      formData.carpas.priceChild
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
