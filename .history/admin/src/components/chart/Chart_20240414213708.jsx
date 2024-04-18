import React, { useEffect, useState,  useContext} from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Cancel';
import { UserContext } from "../context/UserContext.jsx";
import "./chart.scss";

const Chart = ({ title}) => { // Asumiendo que recibes el userId como prop
  const [notifications, setNotifications] = useState([]);
  const {user} = useContext(UserContext);
  console.log("UserId:", userId);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/notifications");
        // Se modifica la clave para incorporar el userId, asegurando que sea específico del usuario
        const closedNotifications = JSON.parse(localStorage.getItem(`closedNotifications-${userId}`)) || [];
        
        const notificationsWithClients = await Promise.all(
          response.data.map(async (notification) => {
            const userResponse = await axios.get(`/user/${notification.client}`);
            const client = userResponse.data;
            return {
              ...notification,
              client: client,
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
  }, [userId]); // Agrega userId como dependencia para re-fetch cuando cambie

  const closeNotification = async (notificationId) => {
    setNotifications(currentNotifications =>
      currentNotifications.map(notification =>
        notification._id === notificationId ? { ...notification, isVisible: false } : notification
      )
    );
    const closedNotificationsKey = `closedNotifications-${userId}`;
    const closedNotifications = JSON.parse(localStorage.getItem(closedNotificationsKey)) || [];
    localStorage.setItem(closedNotificationsKey, JSON.stringify([...closedNotifications, notificationId]));
  };

  const getNotificationColor = (notificationType) => {
    if (notificationType === "Fin de estadia") {
      return "rgba(255, 99, 132, 0.5)";
    } else if (notificationType === "Nueva reserva") {
      return "rgba(255, 205, 86, 0.5)";
    } else {
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
