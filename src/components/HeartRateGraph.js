import React from 'react';
import { Line } from 'react-chartjs-2';
import '../styles/App.css';

const HeartRateGraph = ({ data }) => {
  const chartData = {
    labels: data.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: data.map(entry => entry.heart_rate),
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