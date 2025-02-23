import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// import { fetchVitalsForLastHour, fetchLatestVitals } from '../services/api';
import '../styles/App.css';

const StepCounter = ({ dailyTarget = 10000 }) => {
    const [stepCount, setStepCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            // const result = await fetchVitalsForLastHour();
            const result = { stepCount: 5000 };
            setStepCount(result.stepCount);
        };
        fetchData();

        const interval = setInterval(async () => {
            // const latestData = await fetchLatestVitals();
            const latestData = { stepCount: 100 };
            setStepCount(prevCount => prevCount + latestData.stepCount);
        }, 300000); // 5 minutes

        return () => clearInterval(interval);
    }, []);

    const percentage = (stepCount / dailyTarget) * 100;

    return (
        <div>
            <h2>Step Count</h2>
            <div className='stepContainer'>
                <CircularProgressbar
                    value={percentage}
                    text={`${stepCount} / ${dailyTarget}`}
                    styles={buildStyles({
                        textSize: '12px',
                        pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                        textColor: '#f88',
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7',
                    })}
                />
            </div>
        </div>
    );
};

export default StepCounter;