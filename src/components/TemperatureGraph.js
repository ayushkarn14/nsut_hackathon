import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import '../styles/App.css';

const TemperatureGraph = ({ data }) => {
  const temperatureValues = data.map(entry => entry.body_temperature);
  const minTemperature = Math.min(...temperatureValues);
  const maxTemperature = Math.max(...temperatureValues);

  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Check temperature values and send notification if below 89.6°F or above 102.2°F for 2 consecutive records
    for (let i = 1; i < temperatureValues.length; i++) {
      if ((temperatureValues[i] < 89.6 && temperatureValues[i - 1] < 89.6) ||
          (temperatureValues[i] > 102.2 && temperatureValues[i - 1] > 102.2)) {
        sendNotification(temperatureValues[i]);
        break; // Break the loop after sending the notification
      }
    }
  }, [temperatureValues]);

  const sendNotification = async (value) => {
    if (Notification.permission === 'granted') {
      new Notification('Temperature Alert', {
        body: `Body temperature is ${value}°F. Please take necessary action.`,
        icon: '/path/to/icon.png', // Optional: Add an icon for the notification
      });

      // Store the notification alert in the database
      const token = localStorage.getItem('token');
      await axios.post('http://10.100.93.107:5000/send-notification', {
        userId: 1, // Replace with actual user ID
        alertType: 'Temperature Alert',
        message: `Body temperature is ${value}°F. Please take necessary action.`,
      }, {
        headers: {
          'x-access-token': token,
        },
      });
    }
  };

  const chartData = {
    labels: data.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Body Temperature (°F)',
        data: temperatureValues,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: minTemperature - 2, // Set the minimum value for the y-axis
        max: maxTemperature + 2, // Set the maximum value for the y-axis
        ticks: {
          count: 5
        },
        title: {
          display: true,
          text: '°F'
        }
      }
    }
  };

  return (
    <div className="graph-card">
      <h3>Body Temperature</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TemperatureGraph;