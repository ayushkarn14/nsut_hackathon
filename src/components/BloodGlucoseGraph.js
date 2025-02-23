import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import '../styles/App.css';

const BloodGlucoseGraph = ({ data }) => {
  const glucoseValues = data.map(entry => entry.blood_glucose);
  const minGlucose = Math.min(...glucoseValues);
  const maxGlucose = Math.max(...glucoseValues);

  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Check glucose values and send notification if below 40
    for (let value of glucoseValues) {
      if (value < 40) {
        sendNotification(value);
        break; // Break the loop after sending the notification
      }
    }
  }, [glucoseValues]);

  const sendNotification = async (value) => {
    if (Notification.permission === 'granted') {
      new Notification('Low Blood Glucose Alert', {
        body: `Blood glucose level dropped to ${value} mg/dL. Please take necessary action.`,
        icon: '/path/to/icon.png', // Optional: Add an icon for the notification
      });

      // Store the notification alert in the database
      const token = localStorage.getItem('token');
      await axios.post('http://10.100.93.107:5000/send-notification', {
        userId: 1, // Replace with actual user ID
        alertType: 'Low Blood Glucose Alert',
        message: `Blood glucose level dropped to ${value} mg/dL. Please take necessary action.`,
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
        label: 'Blood Glucose (mg/dL)',
        data: glucoseValues,
        borderColor: 'rgb(226, 216, 88)',
        backgroundColor: 'rgba(204, 206, 87, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: minGlucose - 2, // Set the minimum value for the y-axis
        max: maxGlucose + 2, // Set the maximum value for the y-axis
        ticks: {
          count: 5
        },
        title: {
          display: true,
          text: 'mg/dL'
        }
      }
    }
  };

  return (
    <div className="graph-card">
      <h3>Blood Glucose</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default BloodGlucoseGraph;