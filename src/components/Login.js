import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://10.100.93.107:5000/login', { email, password });
            
            // Store auth data in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isLoggedIn', 'true');
            
            // Redirect to home page
            history.push('/');
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Invalid email or password');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Login</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.button}>Login</button>
            </form>
            <p style={styles.text}>
                Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
            </p>
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
    text: {
        marginTop: '20px',
        color: '#555',
    },
    link: {
        color: '#84cc19',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default Login;