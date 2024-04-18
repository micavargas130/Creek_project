import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Cancel';
import { UserContext } from "../../context/UserContext.jsx"; // Verifica que la ruta sea correcta
import "./chart.scss";

const Chart = ({ title }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchNotifications = async () => {
      try {
        // Obtener notificaciones no cerradas por el usuario actual
        const response = await axios.get(`/notifications/${user._id}`);
        // Enriquecer las notificaciones con datos del cliente
        const notificationsWithClients = await Promise.all(
          response.data.map(async (notification) => {
            const userResponse = await axios.get(`/user/${notification.client}`);
            return {
              ...notification,
              client: userResponse.data
            };
          })
        );
        setNotifications(notificationsWithClients);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]); // Dependencia a 'user' para reaccionar a cambios en el contexto

  const closeNotification = async (notificationId) => {
    try {
      // Llamar a la API para marcar la notificación como cerrada
      await axios.post(`/notifications/close/${notificationId}`, { userId: user.id });
      // Actualizar el estado para reflejar el cambio en la interfaz de usuario
      const updatedNotifications = notifications.filter(notification => notification._id !== notificationId);
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Error closing notification:", error);
    }
  };

  const getNotificationColor = (notificationType) => {
    switch (notificationType) {
      case "Fin de estadia":
        return "rgba(255, 99, 132, 0.5)";
      case "Nueva reserva":
        return "rgba(255, 205, 86, 0.5)";
      default:
        return "rgba(255, 255, 255, 0.5)";
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
              Cliente: {notification.client.first_name} {notification.client.last_name}
              <div className="notification-date">
                {new Date(notification.date).toLocaleString()}
              </div>
            </div>
            <CloseIcon className="cancelIcon" onClick={() => closeNotification(notification._id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;