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
            // Obtenemos la información del cliente asociado a la notificación
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


  const getNotificationColor = (notificationType) => {
    if (notificationType === "Fin de estadia") {
      return "#0333300"; // Color rojo para fin de estadia
    } else if (notificationType === "Nueva reserva") {
      return "yellow"; // Color amarillo para nueva reserva
    } else {
      return "white"; // Por defecto, color blanco
    }
  };

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <div className="notification-grid">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className="notification-card"
            style={{ backgroundColor: getNotificationColor(notification.type) }}
          >
            <div className="notification-type">{notification.type}</div>
            <div className="notification-details">
              {/* Accedemos a los datos del cliente dentro de cada notificación */}
              Cliente: {notification.client.first_name} {notification.client.last_name}
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