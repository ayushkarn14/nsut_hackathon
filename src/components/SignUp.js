import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [profession, setProfession] = useState('');
    const [maritalStatus, setMaritalStatus] = useState(false);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://10.100.91.208:5000/signup', {
                name, email, password, age, profession, marital_status: maritalStatus, height, weight
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isLoggedIn', 'true');
            history.push('/medical-history');
        } catch (error) {
            console.error('Error signing up:', error);
            alert('Error signing up');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Sign Up</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Age</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Profession</label>
                    <input
                        type="text"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Marital Status</label>
                    <div style={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            checked={maritalStatus}
                            onChange={(e) => setMaritalStatus(e.target.checked)}
                            style={styles.checkbox}
                        />
                    </div>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Height (cm)</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Weight (kg)</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Next</button>
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
        alignItems: 'center',
    },
    formGroup: {
        marginBottom: '15px',
        width: '100%',
        textAlign: 'left',
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
        display: 'block',
        textAlign: 'center',
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        display: 'block',
        margin: 'auto',
        width: '90%',
    },
    checkboxContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    checkbox: {
        marginLeft: '10px',
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
        width: '100%'
    },
};

export default SignUp;