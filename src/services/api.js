import axios from 'axios';

const API_URL = 'https://api.example.com/vitals'; // Replace with your actual API endpoint

export const fetchVitalsForLastHour = async () => {
    try {
        const response = await axios.get(`${API_URL}/last-hour`);
        return response.data;
    } catch (error) {
        console.error('Error fetching vitals for the last hour:', error);
        throw error;
    }
};

export const fetchLatestVitals = async () => {
    try {
        const response = await axios.get(`${API_URL}/latest`);
        return response.data;
    } catch (error) {
        console.error('Error fetching latest vitals:', error);
        throw error;
    }
};