import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Cancel';
import { UserContext } from "../../context/UserContext.jsx"; // Verifica que la ruta sea correcta
import "./chart.scss";

const Chart = ({ title }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(UserContext);
  console.log(user)
  

  useEffect(() => {
    // No ejecutar si el usuario no está definido o no tiene _id
    if (!user || !user._id) return;

    const closedNotificationsKey = `closedNotifications-${user._id}`;
    const closedNotifications = JSON.parse(localStorage.getItem(closedNotificationsKey)) || [];

    const fetchNotifications = async () => {
      try {
        // Obtener notificaciones del servidor
        const response = await axios.get("/notifications");

        // Enriquecer las notificaciones con datos del cliente
        const notificationsWithClients = await Promise.all(
          response.data.map(async (notification) => {
            const userResponse = await axios.get(`/user/${notification.client}`);
            return {
              ...notification,
              client: userResponse.data,
              isVisible: !closedNotifications.includes(notification._id)
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

  const closeNotification = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification._id === notificationId ? { ...notification, isVisible: false } : notification
    );
    setNotifications(updatedNotifications);

    const closedNotificationsKey = `closedNotifications-${user._id}`;
    const closedNotifications = JSON.parse(localStorage.getItem(closedNotificationsKey)) || [];
    localStorage.setItem(closedNotificationsKey, JSON.stringify([...closedNotifications, notificationId]));
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