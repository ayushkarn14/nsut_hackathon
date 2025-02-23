import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import '../styles/App.css';

const StepBarGraph = () => {
    const [stepData, setStepData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // const result = await fetchVitalsForLastHour();
            const result = [
                { time: '10:00', value: 500 },
                { time: '11:00', value: 600 },
                { time: '12:00', value: 700 },
                { time: '13:00', value: 800 },
                { time: '14:00', value: 900 },
                { time: '15:00', value: 1000 },
                { time: '16:00', value: 1100 },
                { time: '17:00', value: 1200 },
                { time: '18:00', value: 1300 },
                { time: '19:00', value: 1400 },
                { time: '20:00', value: 1500 },
                { time: '21:00', value: 1600 },
            ];
            setStepData(result);
        };
        fetchData();
    }, []);

    const data = {
        labels: stepData.map(entry => entry.time),
        datasets: [
            {
                label: 'Steps',
                data: stepData.map(entry => entry.value),
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="graph-container">
            <h2>Step Count by Hour</h2>
            <Bar data={data} />
        </div>
    );
};

export default StepBarGraph;