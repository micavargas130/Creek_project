import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Cancel';
import { UserContext } from "../../context/UserContext.jsx";
import "./chart.scss";

const Chart = ({ title }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!user || !user._id) return;

        // Obtener notificaciones que no han sido cerradas por el usuario
        const response = await axios.get(`/notifications/closed/${user._id}`);
        
        const notificationsWithClients = await Promise.all(
          response.data.map(async (notification) => {
            const userResponse = await axios.get(`/user/${notification.client}`);
            return {
              ...notification,
              client: userResponse.data,
              isVisible: true // todas visibles inicialmente
            };
          })
        );
        
        console.log("Notifications with clients:", notificationsWithClients);
        setNotifications(notificationsWithClients);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  const closeNotification = async (notificationId) => {
    try {
      // Enviar solicitud para marcar la notificación como cerrada
      await axios.post(`/notifications/close/${notificationId}`, { userId: user._id });

      // Actualizar el estado para reflejar la notificación cerrada
      setNotifications((prevNotifications) =>
        prevNotifications.filter(notification => notification._id !== notificationId)
      );
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
    <div className="chart"> No
      <div className="title">{title}</div>
      <div className="notification-grid">
        {notifications.filter(notification => notification.isVisible).map((notification) => (
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
