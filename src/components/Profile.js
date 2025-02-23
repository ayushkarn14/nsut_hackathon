import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const Profile = () => {
    const [user, setUser] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://10.100.91.208:5000/profile', {
                    headers: { 'x-access-token': token }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('syncInterval');
        localStorage.removeItem('isLoggedIn');
        history.push('/login');
    };

    return (
        <div className="graph-container profile-container">
            <h2><FaUser className="profile-icon" /> Profile</h2>
            {user ? (
                <div className="profile-card">
                    <div className="profile-avatar">
                        {user.name[0].toUpperCase()}
                    </div>
                    <div className="profile-details">
                        <div className="profile-field">
                            <label>Name</label>
                            <p>{user.name}</p>
                        </div>
                        <div className="profile-field">
                            <label>Age</label>
                            <p>{user.age} years</p>
                        </div>
                        <div className="profile-field">
                            <label>Profession</label>
                            <p>{user.profession}</p>
                        </div>
                        <div className="profile-field">
                            <label>Email</label>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <button className="logout-button" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            ) : (
                <div className="loading-spinner">Loading...</div>
            )}
        </div>
    );
};

export default Profile;