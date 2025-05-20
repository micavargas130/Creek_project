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
        // Obtener el último precio registrado
        const lastCabanasRes = await axiosInstance.get("/prices/last");
        const lastCarpasRes = await axiosInstance.get("/prices/last");
  
        if (!lastCabanasRes.data || !lastCarpasRes.data) {
          console.warn("No se encontraron precios disponibles.");
          return;
        }
  
        setFormData({
          cabanas: lastCabanasRes.data,
          carpas: lastCarpasRes.data,
        });
      } catch (err) {
        console.error("Error al obtener los datos de precios:", err);
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
        axiosInstance.post(`/prices`, formData.cabanas),
        axiosInstance.post(`/prices`, formData.carpas),
      ]);
      setEditing(false);
    } catch (err) {
      console.error("Error creating price data:", err);
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
