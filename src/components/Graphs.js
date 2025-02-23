import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TemperatureGraph from './TemperatureGraph';
import HeartRateGraph from './HeartRateGraph';
import BloodOxygenGraph from './BloodOxygenGraph';
import BloodGlucoseGraph from './BloodGlucoseGraph';

const Graphs = () => {
  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatientData = async () => {
    try {
      const syncInterval = localStorage.getItem('syncInterval');
      if (!syncInterval) {
        setError('Please start data collection from the Home page first');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.get('http://10.100.93.107:5000/patient-data', {
        headers: {
          'x-access-token': token,
        },
      });
      setPatientData(response.data.reverse());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
    const syncInterval = localStorage.getItem('syncInterval');
    
    if (syncInterval) {
      const intervalId = setInterval(fetchPatientData, 30000);
      return () => clearInterval(intervalId);
    }
  }, []);

  if (loading) {
    return <div className="graphs-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="graphs-container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="graphs-container">
      {localStorage.getItem('syncInterval') ? (
        <>
          <HeartRateGraph data={patientData} />
          <TemperatureGraph data={patientData} />
          <BloodOxygenGraph data={patientData} />
          <BloodGlucoseGraph data={patientData} />
        </>
      ) : (
        <div className="error-message">
          Please go to the Home page and start data collection first
        </div>
      )}
    </div>
  );
};

export default Graphs;