import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const PastWearableData = ({ medicalHistories }) => {
    const [csvFile, setCsvFile] = useState(null);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!csvFile) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('csvFile', csvFile);

        medicalHistories.forEach((history, index) => {
            formData.append(`disease_name_${index}`, history.disease);
            formData.append(`duration_weeks_${index}`, history.duration);
            formData.append(`medication_${index}`, history.medication);
            if (history.image) {
                formData.append(`image_${index}`, history.image);
            }
        });

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://10.100.91.208:5000/upload', formData, {
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
            <h2 style={styles.heading}>Past Wearable Data</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Upload CSV File:</label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setCsvFile(e.target.files[0])}
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Submit</button>
            </form>
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
    },
};

export default PastWearableData;