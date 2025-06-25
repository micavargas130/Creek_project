import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../axios/axiosInstance.js"
import CloseIcon from '@mui/icons-material/Cancel';
import { UserContext } from "../../context/UserContext.jsx";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt1';
import "./chart.scss";

const Chart = ({ title }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!user || !user._id) return;
        const response = await axiosInstance.get(`/notifications/closed/${user._id}`);
        

        const enrichedNotifications = await Promise.all(
          response.data.map(async (notification) => {
            console.log("n")
            const userResponse = await axiosInstance.get(`/user/${notification.client._id}`);
            const lodgeResponse = await axiosInstance.get(`/lodges/${notification.cabain._id}`);

            return {
              ...notification,
              client: userResponse.data,
              cabain: lodgeResponse.data,
              isVisible: true
            };
          })
        );

        const sortedNotifications = enrichedNotifications.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  const closeNotification = async (notificationId) => {
    try {
      await axiosInstance.post(`/notifications/close/${notificationId}`, { userId: user._id });
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    } catch (error) {
      console.error("Error closing notification:", error);
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "Fin de estadia":
        return { color: "#FF6B6B", icon: <AssignmentTurnedInIcon style={{ color: "#FF6B6B" }} /> };
      case "Nueva reserva":
        return { color: "#FFD93D", icon: <PersonAddAltIcon style={{ color: "#FFD93D" }} /> };
      case "Reserva Cancelada":
        return { color: "red", icon: <EventBusyIcon style={{ color: "red" }} /> };
      default:
        return { color: "#A0C4FF", icon: <EventAvailableIcon style={{ color: "#A0C4FF" }} /> };
    }
  };

  return (
    <div className="chart">
      Notificaciones
      <div className="title">{title}</div>
      <div className="notification-grid">
        {notifications.filter(n => n.isVisible).map((notification) => (
          <div
            key={notification._id}
            className="notification-card"
            style={{ borderLeft: `5px solid ${getNotificationColor(notification.type).color}` }}
          >
            <div className="notification-icon">
              {getNotificationColor(notification.type).icon}
            </div>
            <div className="notification-content">
              <div className="notification-type">{notification.type}</div>
              <div className="notification-details">
                Cliente: {notification.client.first_name} {notification.client.last_name}
              </div>
              <div className="notification-details">
                Cabaña: {notification.cabain.name || notification.cabain.number || "-"}
              </div>
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