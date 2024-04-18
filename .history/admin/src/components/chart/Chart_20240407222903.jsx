import React, { useEffect, useState } from "react";
import axios from "axios";
import "./chart.scss";

const Chart = ({ title }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/notifications");
        setNotifications(response.data);

        const user = await axios.get(/)


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