import "./new.scss";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";

const New = ({ inputs, title }) => {
  const [lodgePrices, setLodgePrices] = useState({});
  const [tentPrices, setTentPrices] = useState({});
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchPricesData = async () => {
      try {
        const lodgeRes = await axios.get(`/prices/66f8b88d5e41d6ee37542fca`);
        const tentRes = await axios.get(`/prices/66a82bc2ac1709160e479670`);
        setLodgePrices(lodgeRes.data);
        setTentPrices(tentRes.data);
      } catch (err) {
        console.error("Error fetching price data:", err);
      }
    };
    fetchPricesData();
  }, []);

  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "lodge") {
      setLodgePrices((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (type === "tent") {
      setTentPrices((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleFormSubmit = async () => {
    try {
      await axios.put(`/prices/66f8b88d5e41d6ee37542fca`, lodgePrices);
      await axios.put(`/prices/66a82bc2ac1709160e479670`, tentPrices);
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
          {/* Precios de cabañas */}
          <div className="lodgeContainer">
            <div className="lodgeWrapper">
              <div className="lodgeDetails">
                <div className="lodgeDetailsTexts">
                  <h1 className="lodgeMinititle">Precios de Cabañas</h1>
                  <h2 className="lodgeMinititle">Precio Adulto</h2>
                  <p className="lodgeDesc">
                    {editing ? (
                      <input
                        type="number"
                        name="priceAdult"
                        value={lodgePrices.priceAdult || ""}
                        onChange={(e) => handleInputChange(e, "lodge")}
                        className="editInput"
                      />
                    ) : (
                      lodgePrices.priceAdult
                    )}
                  </p>
                  <h2 className="lodgeMinititle">Precio Niño</h2>
                  <p className="lodgeCapacity">
                    {editing ? (
                      <input
                        type="number"
                        name="priceChild"
                        value={lodgePrices.priceChild || ""}
                        onChange={(e) => handleInputChange(e, "lodge")}
                        className="editInput"
                      />
                    ) : (
                      lodgePrices.priceChild
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Precios de carpas */}
          <div className="tentContainer">
            <div className="tentWrapper">
              <div className="tentDetails">
                <div className="tentDetailsTexts">
                  <h1 className="tentMinititle">Precios de Carpas</h1>
                  <h2 className="tentMinititle">Precio Adulto</h2>
                  <p className="tentDesc">
                    {editing ? (
                      <input
                        type="number"
                        name="priceAdult"
                        value={tentPrices.priceAdult || ""}
                        onChange={(e) => handleInputChange(e, "tent")}
                        className="editInput"
                      />
                    ) : (
                      tentPrices.priceAdult
                    )}
                  </p>
                  <h2 className="tentMinititle">Precio Niño</h2>
                  <p className="tentCapacity">
                    {editing ? (
                      <input
                        type="number"
                        name="priceChild"
                        value={tentPrices.priceChild || ""}
                        onChange={(e) => handleInputChange(e, "tent")}
                        className="editInput"
                      />
                    ) : (
                      tentPrices.priceChild
                    )}
                  </p>
                </div>
              </div>
            </div>
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
  );
};

export default New;
