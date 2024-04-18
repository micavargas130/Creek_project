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
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <div className="notification-list">
        {notifications.map((notification) => (
          <div key={notification._id} className="notification">
            <div className="notification-date">
              {new Date(notification.date).toLocaleString()}
            </div>
            <div className="notification-type">{notification.type}</div>
            <div className="notification-details">
              {/* Mostrar otros detalles de la notificación según tu esquema */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;
