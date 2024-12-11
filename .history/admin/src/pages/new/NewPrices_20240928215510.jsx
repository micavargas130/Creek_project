import "./newAccounting.scss";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import {Navigate} from "react-router-dom"

const New = ({ inputs, title }) => {
  const [prices, setPrices] = useState("");
  const [type,setType] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const[redirect,setRedirect] = useState(false);
  

  useEffect(() => {
  
        // Realiza una solicitud al servidor para obtener la información del usuario
            axios.get(`/prices/66a82bc2ac1709160e479670`)
              .then((response) => {
                const pricesInfo = response.data;
  
                // Una vez que tengas todos los datos, puedes actualizar los estados
                setPrices(pricesInfo);
                
          }).catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [pricesId]);


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
        <div className="PriceContainer">
          <div className="lodgeContainer">
            <div className="lodgeWrapper">
          
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
