import React, { useEffect, useState } from "react";
import axios from "axios";
import "./chart.scss";

const Chart = ({ title }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/notifications");
        const notificationsWithClients = await Promise.all(
          response.data.map(async (notification) => {
            // Obtenemos el nombre del cliente asociado a la notificación
            const clientResponse = await axios.get(`/user/${notification.client}`);
            
            const clientName = clientResponse.name;
            console.log(clientName);
            // Retornamos la notificación con el nombre del cliente agregado
            return {
              ...notification,
              clientName: clientName,
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
              Cliente: {notification.clientName}
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