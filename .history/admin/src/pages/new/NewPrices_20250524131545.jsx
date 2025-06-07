import "./new.scss";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axiosInstance from "../../axios/axiosInstance.js"

const New = () => {
  const [formData, setFormData] = useState({
    cabañas: {},
    carpas: {},
  });
  const [priceHistory, setPriceHistory] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchPricesData = async () => {
      try {
        // Obtener todos los registros de precios
        const pricesRes = await axiosInstance.get("/prices");

        // Filtrar precios de cabañas y carpas
        const cabañasPrices = pricesRes.data.filter(price => price.category === "cabañas");
        const carpasPrices = pricesRes.data.filter(price => price.category === "carpas");

        // Obtener los últimos precios de cabañas y carpas
        const lastCabañasPrice = cabañasPrices[cabanasPrices.length - 1] || {};
        const lastCarpasPrice = carpasPrices[carpasPrices.length - 1] || {};

        setFormData({
          cabanas: lastCabanasPrice,
          carpas: lastCarpasPrice,
        });

        setPriceHistory(pricesRes.data); // Guardar todos los registros de precios
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
      // Aquí solo se envían los datos de precios sin un _id
      await Promise.all([
        axiosInstance.post("/prices", { priceAdult: formData.cabanas.priceAdult, priceChild: formData.cabanas.priceChild, category: "cabanas" }),
        axiosInstance.post("/prices", { priceAdult: formData.carpas.priceAdult, priceChild: formData.carpas.priceChild, category: "carpas" }),
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
                        onChange={(e) => handleInputChange(e, "cabañas")}
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
         {/* Historial de Precios */}
         <h2 className="sectionTitle">Historial de Precios</h2>
                {priceHistory.length > 0 ? (
                  <div className="tableContainer">
                    <table className="priceHistoryTable">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Categoría</th>
                          <th>Precio Adulto</th>
                          <th>Precio Niño</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priceHistory.map((price) => (
                          <tr key={price._id}>
                            <td>{new Date(price.createdAt).toLocaleDateString()}</td>
                            <td>{price.category}</td>
                            <td>${price.priceAdult}</td>
                            <td>${price.priceChild}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No hay historial de precios disponible.</p>
                )}
      </div>
    </div>
  );
};

export default New;
