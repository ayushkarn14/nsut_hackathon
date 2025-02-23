import React from 'react';
import { Line } from 'react-chartjs-2';
import '../styles/App.css';

const BloodGlucoseGraph = ({ data }) => {
  const chartData = {
    labels: data.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Blood Glucose (mg/dL)',
        data: data.map(entry => entry.blood_glucose),
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