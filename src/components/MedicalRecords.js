import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/MedicalRecords.css';

const MedicalRecords = () => {
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedicalHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://10.100.93.107:5000/health-conditions', {
                    headers: {
                        'x-access-token': token
                    }
                });
                setMedicalHistory(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching medical history:', error);
                toast.error('Failed to load medical history');
                setLoading(false);
            }
        };

        fetchMedicalHistory();
    }, []);

    return (
        <div className="medical-records-container">
            <h2>Medical Records</h2>
            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : medicalHistory.length > 0 ? (
                <div className="medical-records-grid">
                    {medicalHistory.map((condition, index) => (
                        <div key={index} className="condition-card">
                            <h3>{condition.condition_name}</h3>
                            <div className="condition-details">
                                <p><strong>Duration:</strong> {condition.duration_weeks} weeks</p>
                                <p><strong>Medication:</strong> {condition.medication || 'None prescribed'}</p>
                                <p><strong>Status:</strong> {condition.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-history">
                    <p>No medical history records found.</p>
                </div>
            )}
        </div>
    );
};

export default MedicalRecords;