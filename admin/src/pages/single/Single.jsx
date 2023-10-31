import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const Single = () => {

  const [user, setUser] = useState({});
  const [lodge, setLodge] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtén el ID del usuario de la URL
  const { bookingId } = useParams();

  useEffect(() => {
    // Realiza una solicitud al servidor para obtener la información de la reserva
    axios.get(`/bookings/${bookingId}`)
      .then((response) => {
        const booking = response.data;


        // Una vez que tengas la información de la reserva, puedes acceder al ID del usuario y al ID de la cabaña
        const userId = booking.user;
        const lodgeId = booking.place;


        // Realiza una solicitud al servidor para obtener la información del usuario
        axios.get(`/user/${userId}`)
          .then((userResponse) => {
            setUser(userResponse.data);
          })
          .catch((userError) => {
            setError(userError);
          });

        // Realiza una solicitud al servidor para obtener la información de la cabaña
        axios.get(`/lodges/${lodgeId}`)
          .then((lodgeResponse) => {
            setLodge(lodgeResponse.data);
          })
          .catch((lodgeError) => {
            setError(lodgeError);
          });

        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [bookingId]);



  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
          
              <div className="details">
                <h1 className="itemTitle">{user.first_name} {user.last_name}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{user.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">+1 2345 67 89</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">DNI:</span>
                  <span className="itemValue">
                  {user.dni}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Country:</span>
                  <span className="itemValue">USA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
        <h1 className="title">Información de la cabaña</h1>
        <h1 className="itemTitle">{lodge.description}</h1>
          
        </div>
      </div>

      

    </div>

    
  );
};

export default Single;
