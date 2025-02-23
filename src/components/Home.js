import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StepCounter from './StepCounter';
import { FaRegClock } from 'react-icons/fa';
import watchImage from '../resources/watch.png'; // Import the watch image
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Add this function before the Home component
const getSeverityColor = (severity) => {
    switch (Math.floor(severity)) {
        case 0:
            return '#FFFFFF'; // White
        case 1:
            return '#FFF9C4'; // Light Yellow
        case 2:
            return '#FFE082'; // Yellow
        case 3:
            return '#FFB74D'; // Orangish Yellow
        case 4:
            return '#FF9800'; // Orange
        case 5:
            return '#FF5252'; // Red
        default:
            return '#FFFFFF';
    }
};

const Home = ({ setDuration, duration }) => {
    const [suggestions, setSuggestions] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const [isWatchActive, setIsWatchActive] = useState(false);
    const [userData, setUserData] = useState(null);

    // Fetch user data including sync_interval
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://10.100.93.107:5000/user-data', {
                    headers: {
                        'x-access-token': token,
                    },
                });
                setUserData(response.data);
                
                // If sync_interval exists, set watch as active and update duration
                if (response.data.sync_interval) {
                    setIsWatchActive(true);
                    setDuration(response.data.sync_interval);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [setDuration]);

    // Add this new useEffect for handling initial page load
    useEffect(() => {
        const handleInitialLoad = () => {
            const storedInterval = localStorage.getItem('syncInterval');
            if (storedInterval) {
                setDuration(storedInterval);
                setIsWatchActive(true);
                // Simulate watch click
                const watchElement = document.querySelector('.watch-image');
                if (watchElement) {
                    watchElement.click();
                }
            }
        };

        handleInitialLoad();
    }, []); // Empty dependency array means this runs once on mount

    const handleWatchClick = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Handle sync interval logic
            if (!isWatchActive && !userData?.sync_interval) {
                try {
                    await axios.post('http://10.100.93.107:5000/store-sync-interval', 
                        { interval: duration },
                        {
                            headers: {
                                'x-access-token': token,
                            },
                        }
                    );
                    localStorage.setItem('syncInterval', duration);
                    console.log('Sync interval stored successfully');
                } catch (error) {
                    console.error('Error storing sync interval:', error);
                    return;
                }
            }

            setIsWatchActive(true);
            
            // Make API calls in sequence since we need heart data for prediction
            const [fullDataResponse, heartDataResponse] = await Promise.all([
                axios.get('http://10.100.93.107:8000/send_full_data'),
                axios.get('http://10.100.93.107:8000/send_heart_data')
            ]);

            console.log('Full data response:', fullDataResponse.data);
            console.log('Heart data response:', heartDataResponse.data);

            // Send heart data to predict endpoint
            const predictResponse = await axios.post('http://10.100.93.107:8000/predict', heartDataResponse.data);
            console.log('Prediction response:', predictResponse.data.predicted_label);
            
            const predictedLabel = predictResponse.data.predicted_label;
            if (['S', 'V', 'F'].includes(predictedLabel)) {
                const labelMap = {
                    'S': 'Supraventricular ectopic beat',
                    'V': 'Ventricular ectopic beat',
                    'F': 'Fusion beat'
                };
                
                toast.warning(`Abnormal Heart Rhythm Detected: ${labelMap[predictedLabel]}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }

            // Store the full data in your database
            await axios.post('http://10.100.93.107:5000/store-patient-data', fullDataResponse.data, {
                headers: {
                    'x-access-token': token,
                },
            });
        } catch (error) {
            toast.error('Error processing heart data');
            console.error('Error:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
        }
    };

    const handleDurationChange = (e) => {
        setDuration(e.target.value);
        if (intervalId) {
            clearInterval(intervalId);
        }
        const interval = getIntervalFromDuration(e.target.value);
        const newIntervalId = setInterval(handleWatchClick, interval);
        setIntervalId(newIntervalId);
    };

    const getIntervalFromDuration = (duration) => {
        switch (duration) {
            case '30sec':
                return 30000;
            case '1min':
                return 60000;
            case '5mins':
                return 300000;
            case '10mins':
                return 600000;
            default:
                return 30000;
        }
    };

    useEffect(() => {
        const interval = getIntervalFromDuration(duration);
        const newIntervalId = setInterval(handleWatchClick, interval);
        setIntervalId(newIntervalId);

        return () => clearInterval(newIntervalId); // Cleanup interval on component unmount
    }, [duration]);

    // Modify the fetchSuggestions function in the useEffect
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                // First check localStorage
                const cachedSuggestions = localStorage.getItem('suggestions');
                if (cachedSuggestions) {
                    setSuggestions(JSON.parse(cachedSuggestions));
                    return;
                }

                const token = localStorage.getItem('token');
                const response = await axios.get('http://10.100.93.107:5000/user-data', {
                    headers: {
                        'x-access-token': token,
                    },
                });
                console.log('User data:', response.data);

                // Send data to medical analysis endpoint
                const endpoint = 'http://10.100.93.107:8000/MedicalAnalysis';
                const dummyResponse = await axios.post(endpoint, response.data);
                console.log('Medical Analysis response:', dummyResponse.data);

                // Store in localStorage
                localStorage.setItem('suggestions', JSON.stringify(dummyResponse.data));
                setSuggestions(dummyResponse.data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };

        fetchSuggestions();
        // Set up interval to fetch suggestions periodically
        const suggestionIntervalId = setInterval(fetchSuggestions, 30000); // Fetch every 30 seconds

        return () => clearInterval(suggestionIntervalId); // Cleanup on unmount
    }, []); // Empty dependency array means this runs once on mount

    return (
        <>
            <ToastContainer />
            <div className="graph-container">
                <h2>Suggestions</h2>
                {suggestions ? (
                    <div>
                        {Object.keys(suggestions).map((condition, index) => (
                            <div 
                                key={index} 
                                style={{
                                    ...styles.suggestionCard,
                                    backgroundColor: getSeverityColor(suggestions[condition].severity),
                                    // Adjust text color for better contrast on darker backgrounds
                                    color: suggestions[condition].severity >= 4 ? '#FFFFFF' : '#000000'
                                }}
                            >
                                <h3>{condition.replace('_', ' ').toUpperCase()}</h3>
                                <p><strong>Severity:</strong> {suggestions[condition].severity}</p>
                                <p><strong>Reason:</strong> {suggestions[condition].reason}</p>
                                <p><strong>First Aid:</strong></p>
                                <ul>
                                    {suggestions[condition].first_aid.map((aid, aidIndex) => (
                                        <li key={aidIndex}>{aid}</li>
                                    ))}
                                </ul>
                                <p><strong>Doctor Intervention:</strong> {suggestions[condition].doctor_intervention}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Loading suggestions...</p>
                )}
            </div>
            <div className="graph-container" style={styles.lastGraphContainer}>
                {!isWatchActive && !userData?.sync_interval && (
                    <div style={styles.selectContainer}>
                        <div style={styles.selectGroup}>
                            <label htmlFor="deviceSelect" style={styles.label}>Select Device:</label>
                            <select id="deviceSelect" style={styles.select}>
                                <option value="apple_watch_10">Apple Watch 10</option>
                                <option value="realme_watch">Realme Watch</option>
                                <option value="anarc_watch">Anarc Watch</option>
                            </select>
                        </div>
                        <div style={styles.selectGroup}>
                            <label htmlFor="durationSelect" style={styles.label}>Select Duration:</label>
                            <select id="durationSelect" style={styles.select} onChange={handleDurationChange} value={duration}>
                                <option value="30sec">30 sec</option>
                                <option value="1min">1 min</option>
                                <option value="5mins">5 mins</option>
                                <option value="10mins">10 mins</option>
                            </select>
                        </div>
                    </div>
                )}
                <div style={styles.watchContainer}>
                    <img 
                        src={watchImage} 
                        alt="Watch" 
                        className="watch-image" // Add this class for querySelector
                        style={{
                            ...styles.watchImage,
                            ...(isWatchActive && styles.activeWatchImage)
                        }} 
                        onClick={handleWatchClick} 
                    />
                </div>
            </div>
        </>
    );
};

const styles = {
    suggestionCard: {
        padding: '20px',
        margin: '10px 0',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease', // Smooth transition for color changes
    },
    watchImage: {
        width: '50px',
        height: '50px',
        display: 'block',
        margin: 'auto',
        border: '2px solid lightgrey',
        borderRadius: '50%',
        padding: '10px',
        cursor: 'pointer', // Add cursor pointer to indicate clickable element
        transition: 'all 0.3s ease',
    },
    activeWatchImage: {
        border: '2px solid #4CAF50',
        boxShadow: '0 0 20px rgba(76, 175, 80, 0.6)',
        transform: 'scale(1.1)',
    },
    lastGraphContainer: {
        marginBottom: '40px', // Add margin-bottom to the last graph-container
    },
    selectContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: '20px',
    },
    selectGroup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    select: {
        padding: '5px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    watchContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px',
    },
};

export default Home;