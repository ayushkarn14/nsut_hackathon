const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
    host: '0.0.0.0',
    user: 'root',
    password: 'password',
    database: 'health_dashboard',
    connectionLimit: 100 // Adjust the limit as needed
};

const pool = mysql.createPool(dbConfig);

const secretKey = 's3cr3tK3yG3n3r4t3dByOp3nSSL==';

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Function to insert notification alert into the database
const insertNotificationAlert = (userId, alertType, message) => {
    const query = 'INSERT INTO notification_alerts (user_id, alert_type, message) VALUES (?, ?, ?)';
    pool.query(query, [userId, alertType, message], (err, result) => {
        if (err) {
            console.error('Error inserting notification alert:', err);
        } else {
            console.log('Notification alert inserted successfully');
        }
    });
};

// Endpoint to send a notification and store it in the database
app.post('/send-notification', (req, res) => {
    const { userId, alertType, message } = req.body;

    // Insert the notification alert into the database
    insertNotificationAlert(userId, alertType, message);

    res.status(200).send('Notification sent and stored successfully');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});