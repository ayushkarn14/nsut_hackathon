import React from 'react';
import { Line } from 'react-chartjs-2';
import '../styles/App.css';

const BloodOxygenGraph = ({ data }) => {
  const chartData = {
    labels: data.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'SpO2 (%)',
        data: data.map(entry => entry.spo2),
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