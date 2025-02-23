import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        // Fetch user details and medical conditions when component mounts
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://10.100.91.208:5000/user-data-for-context', {
                    headers: {
                        'x-access-token': token
                    }
                });
                setUserDetails(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleSend = async () => {
        if (!message.trim()) return;

        try {
            const payload = {
                prompt: message,
                context: userDetails
            };

            const response = await axios.post('http://10.100.93.107:8000/generate_response', payload);
            setResponse(response.data.response);
            console.log(response.data.response);
            setMessage(''); // Clear input after sending
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (<>
        <div className="graph-container chat-container">
            <h2>Chat with AI Assistant</h2>

            {/* Chat input area */}
            <div className="chat-input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="chat-input"
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="chat-send-button"
                    aria-label="Send message"
                >
                    →
                </button>
            </div>
        </div>
        {response && (
            <div className="graph-container chat-response">
                <p>{response}</p>
            </div>
        )}
    </>);
};

export default Chat;