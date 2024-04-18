import React, { useEffect, useState } from "react";
import axios from "axios";
import "./chart.scss";

const Chart = ({ title }) => {
  const [notifications, setNotifications] = useState([]);
  const [client, setClient] = useState({});

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/notifications");
        const notificationsWithClients = await Promise.all(
          response.data.map(async (notification) => {
            // Obtenemos el nombre del cliente asociado a la notificación
            const userResponse = await axios.get(`/user/${notification.client}`);
            const client = userResponse.data;
            
            // Retornamos la notificación con la información del cliente agregada
            return {
              ...notification,
              client: client // Agregamos el cliente a la notificación
            };
          })
        );
  
        setNotifications(notificationsWithClients);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
  
    fetchNotifications();
  }, []);

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <div className="notification-grid">
        {notifications.map((notification) => (
          <div key={notification._id} className="notification-card">
            <div className="notification-type">{notification.type}</div>
            <div className="notification-details">
              Cliente: {client.first_name} {client.last_name}
              <div className="notification-date">
                {new Date(notification.date).toLocaleString()}
              </div>
              {/* Mostrar otros detalles de la notificación según tu esquema */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;