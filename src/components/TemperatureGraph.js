import React from 'react';
import { Line } from 'react-chartjs-2';
import '../styles/App.css';

const TemperatureGraph = ({ data }) => {
  const chartData = {
    labels: data.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Body Temperature (°F)',
        data: data.map(entry => entry.body_temperature),
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