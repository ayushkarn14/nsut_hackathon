import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const MedicalHistory = () => {
    const [medicalHistories, setMedicalHistories] = useState([]);
    const [diseaseName, setDiseaseName] = useState('');
    const [durationWeeks, setDurationWeeks] = useState('');
    const [medication, setMedication] = useState('');
    const [image, setImage] = useState(null);
    const history = useHistory();

    const handleAddCondition = () => {
        setMedicalHistories([...medicalHistories, { disease: diseaseName, duration: durationWeeks, medication, image }]);
        setDiseaseName('');
        setDurationWeeks('');
        setMedication('');
        setImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        medicalHistories.forEach((history, index) => {
            formData.append(`disease_name_${index}`, history.disease || '');
            formData.append(`duration_weeks_${index}`, history.duration || '');
            formData.append(`medication_${index}`, history.medication || '');
            if (history.image) {
                formData.append(`image_${index}`, history.image);
            }
        });

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://10.100.93.107:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': token,
                },
            });
            alert('Files uploaded successfully');
            console.log('Files uploaded:', response.data);
            history.push('/login');
        } catch (error) {
            console.error('Error uploading files:', error);
            alert('Error uploading files');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Medical History</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Disease Name:</label>
                    <input
                        type="text"
                        value={diseaseName}
                        onChange={(e) => setDiseaseName(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Duration (weeks):</label>
                    <input
                        type="number"
                        value={durationWeeks}
                        onChange={(e) => setDurationWeeks(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Medication:</label>
                    <input
                        type="text"
                        value={medication}
                        onChange={(e) => setMedication(e.target.value)}
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Upload Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => setImage(e.target.files[0])}
                        style={styles.input}
                    />
                </div>
                <button type="button" onClick={handleAddCondition} style={styles.button}>Add Condition</button>
                <button type="submit" style={styles.button}>Submit</button>
            </form>
            <div>
                <h3 style={styles.heading}>Added Conditions:</h3>
                <ul>
                    {medicalHistories.map((cond, index) => (
                        <li key={index}>{cond.disease} - {cond.duration} weeks - {cond.medication}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const styles = {
    container: {
        width: '80vw',
        maxWidth: '400px',
        margin: '20px auto',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        textAlign: 'center',
    },
    heading: {
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        width: '80%',
    },
    button: {
        padding: '10px',
        backgroundColor: '#84cc19',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '10px',
    },
};

export default MedicalHistory;