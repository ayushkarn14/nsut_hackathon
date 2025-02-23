import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const HealthConditions = ({ setMedicalHistories }) => {
    const [conditions, setConditions] = useState([]);
    const [condition, setCondition] = useState({ disease: '', duration: '', medication: '', image: null });
    const history = useHistory();

    const handleAddCondition = () => {
        setConditions([...conditions, condition]);
        setCondition({ disease: '', duration: '', medication: '', image: null });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMedicalHistories(conditions);
        history.push('/past-wearable-data');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Health Conditions</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Disease Name:</label>
                    <input
                        type="text"
                        value={condition.disease}
                        onChange={(e) => setCondition({ ...condition, disease: e.target.value })}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Duration (weeks):</label>
                    <input
                        type="number"
                        value={condition.duration}
                        onChange={(e) => setCondition({ ...condition, duration: e.target.value })}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Medication Used:</label>
                    <input
                        type="text"
                        value={condition.medication}
                        onChange={(e) => setCondition({ ...condition, medication: e.target.value })}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Image (optional):</label>
                    <input
                        type="file"
                        onChange={(e) => setCondition({ ...condition, image: e.target.files[0] })}
                        style={styles.input}
                    />
                </div>
                <button type="button" onClick={handleAddCondition} style={styles.button}>Add Condition</button>
                <button type="submit" style={styles.button}>Next</button>
            </form>
            <div>
                <h3 style={styles.heading}>Added Conditions:</h3>
                <ul>
                    {conditions.map((cond, index) => (
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

export default HealthConditions;