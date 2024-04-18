import React, { useEffect, useState } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Cancel';
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
      return "rgba(255, 99, 132, 0.5)"; // Color rojo pastel con opacidad baja
    } else if (notificationType === "Nueva reserva") {
      return "rgba(255, 205, 86, 0.5)"; // Color amarillo pastel con opacidad baja
    } else {
      return "rgba(255, 255, 255, 0.5)"; // Por defecto, color blanco pastel con opacidad baja
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
           
            <CloseIcon className="icon" />
          </div>
        ))}
           
            
        
         
      </div>
    </div>
  );
};

export default Chart;