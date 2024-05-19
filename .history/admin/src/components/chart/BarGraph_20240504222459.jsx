import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Cancel';
import { UserContext } from "../../context/UserContext.jsx";
import "./chart.scss";
import { Bar } from 'react-chartjs-2';

const BarChart = ({ title, totalMoney, totalIncome, totalExpense }) => {
  const data = {
    labels: ['Total Money', 'Total Income', 'Total Expense'],
    datasets: [
      {
        label: 'Amount',
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 205, 86, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)'
        ],
        borderWidth: 1,
        data: [totalMoney, totalIncome, totalExpense]
      }
    ]
  };

  return (
    <div className="bar-chart">
      <div className="title">{title}</div>
      <Bar data={data} />
    </div>
  );
};

const Chart = ({ title }) => {
  const [notifications, setNotifications] = useState([]);
  const [totalMoney, setTotalMoney] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchData = async () => {
      try {
        // Obtener notificaciones que no han sido cerradas por el usuario
        const response = await axios.get(`/notifications/closed/${user.id}`);
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
        setNotifications(notificationsWithClients);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchData();

    const fetchFinancialData = async () => {
      try {
        // Obtener los datos financieros del camping
        const financialDataResponse = await axios.get(`/financialData`);
        setTotalMoney(financialDataResponse.data.totalMoney);
        setTotalIncome(financialDataResponse.data.totalIncome);
        setTotalExpense(financialDataResponse.data.totalExpense);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };

    fetchFinancialData();
  }, [user]);

  const closeNotification = async (notificationId) => {
    try {
      // Enviar solicitud para marcar la notificación como cerrada
      await axios.post(`/notifications/close/${notificationId}`, { userId: user.id });
      // Actualizar el estado para reflejar la notificación cerrada
      const updatedNotifications = notifications.map(notification =>
        notification._id === notificationId ? { ...notification, isVisible: false } : notification
      );
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
      <BarChart
        title="Financial Data Comparison"
        totalMoney={totalMoney}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
      />
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
