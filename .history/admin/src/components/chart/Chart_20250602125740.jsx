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

        // Obtener notificaciones que no han sido cerradas por el usuario
        const response = await axiosInstance.get(`/notifications/closed/${user._id}`);
        
        const notificationsWithClients = await Promise.all(
          response.data.map(async (notification) => {
            const userResponse = await axiosInstance.get(`/user/${notification.client}`);
            return {
              ...notification,
              client: userResponse.data,
              isVisible: true // todas visibles inicialmente
            };
          })
        );
        const sortedNotifications = notificationsWithClients.sort(
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
      // Enviar solicitud para marcar la notificación como cerrada
      await axiosInstance.post(`/notifications/close/${notificationId}`, { userId: user._id });

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
      return { color: "#FF6B6B", icon: <AssignmentTurnedInIcon style={{ color: "#FF6B6B" }} /> };
    case "Nueva reserva":
      return { color: "#FFD93D", icon: <PersonAddAltIcon style={{ color: "#FFD93D" }} /> };
    case "Reserva Cancelada":
      return {color: "red", icon: <EventBusyIcon style = {{ color: "red" }}  /> };
    default:
      return { color: "#A0C4FF", icon: <EventAvailableIcon style={{ color: "#A0C4FF" }} /> };
  }
};


  return (
    <div className="chart"> Notificaciones
      <div className="title">{title}</div>
      <div className="notification-grid">
        {notifications.filter(notification => notification.isVisible).map((notification) => (
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
               Cabaña: {notification.cabain}
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
