import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import '../styles/App.css';

const BloodOxygenGraph = ({ data }) => {
  const oxygenValues = data.map(entry => entry.spo2);
  const minOxygen = Math.min(...oxygenValues);
  const maxOxygen = Math.max(...oxygenValues);

  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Check SpO2 values and send notification if below 90%
    for (let value of oxygenValues) {
      if (value < 90) {
        sendNotification(value);
        break; // Break the loop after sending the notification
      }
    }
  }, [oxygenValues]);

  const sendNotification = async (value) => {
    if (Notification.permission === 'granted') {
      new Notification('Low SpO2 Alert', {
        body: `SpO2 dropped to ${value}%. Please take necessary action.`,
        icon: '/path/to/icon.png', // Optional: Add an icon for the notification
      });

      // Store the notification alert in the database
      const token = localStorage.getItem('token');
      await axios.post('http://10.100.93.107:5000/send-notification', {
        userId: 1, // Replace with actual user ID
        alertType: 'Low SpO2 Alert',
        message: `SpO2 dropped to ${value}%. Please take necessary action.`,
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
        label: 'SpO2 (%)',
        data: oxygenValues,
        borderColor: 'rgb(70, 185, 164)',
        backgroundColor: 'rgba(65, 162, 159, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: minOxygen - 2, // Set the minimum value for the y-axis
        max: maxOxygen + 2, // Set the maximum value for the y-axis
        ticks: {
          count: 5
        },
        title: {
          display: true,
          text: '%'
        }
      }
    }
  };

  return (
    <div className="graph-card">
      <h3>SpO2</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default BloodOxygenGraph;