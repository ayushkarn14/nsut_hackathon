import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import '../styles/App.css';

const HeartRateGraph = ({ data }) => {
  const heartRateValues = data.map(entry => entry.heart_rate);
  const minHeartRate = Math.min(...heartRateValues);
  const maxHeartRate = Math.max(...heartRateValues);

  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Check heart rate values and send notification if below 60 or above 100
    for (let value of heartRateValues) {
      if (value < 60 || value > 100) {
        sendNotification(value);
        break; // Break the loop after sending the notification
      }
    }
  }, [heartRateValues]);

  const sendNotification = async (value) => {
    if (Notification.permission === 'granted') {
      new Notification('Heart Rate Alert', {
        body: `Heart rate is ${value} BPM. Please take necessary action.`,
        icon: '/path/to/icon.png', // Optional: Add an icon for the notification
      });

      // Store the notification alert in the database
      const token = localStorage.getItem('token');
      await axios.post('http://10.100.93.107:5000/send-notification', {
        userId: 1, // Replace with actual user ID
        alertType: 'Heart Rate Alert',
        message: `Heart rate is ${value} BPM. Please take necessary action.`,
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
        label: 'Heart Rate (BPM)',
        data: heartRateValues,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: minHeartRate - 2, // Set the minimum value for the y-axis
        max: maxHeartRate + 2, // Set the maximum value for the y-axis
        ticks: {
          count: 5
        },
        title: {
          display: true,
          text: 'BPM'
        }
      }
    }
  };

  return (
    <div className="graph-card">
      <h3>Heart Rate</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HeartRateGraph;