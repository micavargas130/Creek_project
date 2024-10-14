import "./new.scss";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";

const New = ({ inputs, title }) => {
  const [prices, setPrices] = useState("");
  const [type,setType] = useState('');
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const[redirect,setRedirect] = useState(false);
  

  useEffect(() => {
    const fetchPricesData = async () => {
      try {
        const res = await axios.get(`/prices/66a82bc2ac1709160e479670`);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching lodge data:", err);
      }
    };
    fetchPricesData();
  });


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
    try {
      await axios.put(`/lodges/66a82bc2ac1709160e479670`, formData);
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
                  <h1 className="lodgeMinititle">Precio Adulto</h1>
                  <p className="lodgeDesc">
                    {editing ? (
                      <textarea
                        name="description"
                        value={formData.priceAdult || ''}
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
                        name="capacity"
                        value={formData.priceChild || ''}
                        onChange={handleInputChange}
                        className="editInput"
                      />
                    ) : (
                      formData.priceChild
                    )}
                  </p>
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

export default New;