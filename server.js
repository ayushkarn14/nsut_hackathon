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
    host: '10.100.91.208',
    user: 'root',
    password: 'password',
    database: 'health_dashboard'
};

let db;

function handleDisconnect() {
    db = mysql.createConnection(dbConfig);

    db.connect(err => {
        if (err) {
            console.error('Error connecting to the database:', err);
            setTimeout(handleDisconnect, 2000);
            return;
        }
        console.log('Connected to the database');
    });

    db.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' ||
            err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

const secretKey = 's3cr3tK3yG3n3r4t3dByOp3nSSL==';

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Signup endpoint
app.post('/signup', (req, res) => {
    const { name, email, password, age, profession, marital_status, height, weight } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = 'INSERT INTO users (name, email, password, age, profession, marital_status, height, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, email, hashedPassword, age, profession, marital_status, height, weight], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).send('Error inserting user');
        }

        // Generate a token for the new user
        const userId = result.insertId;
        const token = jwt.sign({ id: userId }, secretKey, { expiresIn: 86400 }); // 24 hours
        console.log('Token generated for new user:', token);

        res.status(201).send({ auth: true, token });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Error fetching user');
        }
        if (results.length === 0) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        const user = results[0];
        console.log('User found:', user);
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        console.log('Password is valid:', passwordIsValid);
        if (!passwordIsValid) {
            console.log('Invalid password');
            return res.status(401).send('Invalid password');
        }

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: 86400 }); // 24 hours
        console.log('Token generated:', token);
        res.status(200).send({ auth: true, token });
    });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send('No token provided');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(500).send('Failed to authenticate token');
        }
        req.userId = decoded.id;
        next();
    });
};

// Endpoint to handle file uploads
app.post('/upload', verifyToken, upload.any(), (req, res) => {
    const images = req.files || [];

    const healthConditionsValues = [];
    for (let i = 0; req.body[`disease_name_${i}`]; i++) {
        healthConditionsValues.push([
            req.userId,
            req.body[`disease_name_${i}`] || null,
            req.body[`duration_weeks_${i}`] || null,
            req.body[`medication_${i}`] || null,
            images.find(file => file.fieldname === `image_${i}`) ? images.find(file => file.fieldname === `image_${i}`).path : null
        ]);
    }

    if (healthConditionsValues.length > 0) {
        const healthConditionsQuery = 'INSERT INTO health_conditions (user_id, disease_name, duration_weeks, medication, image_url) VALUES ?';
        db.query(healthConditionsQuery, [healthConditionsValues], (err, result) => {
            if (err) {
                console.error('Error saving health conditions to database:', err);
                return res.status(500).send('Error saving health conditions to database');
            }

            console.log('Health conditions saved to database');
            res.status(201).send('Files uploaded successfully');
        });
    } else {
        res.status(201).send('No health conditions to upload');
    }
});

// Endpoint to fetch user data
app.get('/user-data', verifyToken, (req, res) => {
    const userId = req.userId;

    const userQuery = 'SELECT age, name, profession, marital_status AS married, height, weight FROM users WHERE id = ?';
    const medicalQuery = 'SELECT disease_name, duration_weeks AS duration, medication AS medication_used, image_url AS supporting_images FROM health_conditions WHERE user_id = ?';

    db.query(userQuery, [userId], (err, userResults) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).send('Error fetching user data');
        }

        db.query(medicalQuery, [userId], async (err, medicalResults) => {
            if (err) {
                console.error('Error fetching medical data:', err);
                return res.status(500).send('Error fetching medical data');
            }

            const medicalData = await Promise.all(medicalResults.map(async medical => {
                let base64Image = null;
                if (medical.supporting_images) {
                    const imagePath = path.join(__dirname, medical.supporting_images);
                    const imageBuffer = fs.readFileSync(imagePath);
                    base64Image = imageBuffer.toString('base64');
                }
                return {
                    disease_name: medical.disease_name,
                    duration: medical.duration.toString(),
                    medication_used: medical.medication_used,
                    supporting_images: base64Image ? [base64Image] : []
                };
            }));

            const userData = {
                personal_details: userResults[0],
                medical_data: medicalData
            };

            res.status(200).send(userData);
        });
    });
});

// Endpoint to store patient data
app.post('/store-patient-data', verifyToken, (req, res) => {
    const {
        "Patient ID": patient_id,
        "Timestamp": timestamp,
        "Age": age,
        "Gender": gender,
        "Weight": weight,
        "Height": height,
        "BMI": bmi,
        "Heart Rate": heart_rate,
        "BP Systolic": bp_systolic,
        "BP Diastolic": bp_diastolic,
        "SpO2": spo2,
        "Respiration Rate": respiration_rate,
        "Body Temperature": body_temperature,
        "Blood Glucose": blood_glucose,
        "Activity Level": activity_level,
        "Sleep Pattern": sleep_pattern
    } = req.body;

    const query = `
        INSERT INTO patient_data (
            patient_id, timestamp, age, gender, weight, height, bmi, heart_rate, bp_systolic, bp_diastolic, spo2, respiration_rate, body_temperature, blood_glucose, activity_level, sleep_pattern
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        patient_id, timestamp, age, gender, weight, height, bmi, heart_rate, bp_systolic, bp_diastolic, spo2, respiration_rate, body_temperature, blood_glucose, activity_level, sleep_pattern
    ], (err, result) => {
        if (err) {
            console.error('Error storing patient data:', err);
            return res.status(500).send('Error storing patient data');
        }

        console.log('Patient data stored successfully');
        res.status(201).send('Patient data stored successfully');
    });
});

// Endpoint to fetch the last 20 records from the patient_data table
app.get('/patient-data', verifyToken, (req, res) => {
    const query = `
        SELECT timestamp, heart_rate, body_temperature, blood_glucose, bp_systolic, bp_diastolic, spo2 
        FROM patient_data 
        ORDER BY timestamp DESC 
        LIMIT 20
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching patient data:', err);
            return res.status(500).send('Error fetching patient data');
        }

        res.status(200).json(results);
    });
});

// Protected route example
app.get('/profile', verifyToken, (req, res) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [req.userId], (err, results) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            return res.status(500).send('Error fetching user profile');
        }
        res.status(200).send(results[0]);
    });
});
// Add this new endpoint after your existing endpoints
app.post('/store-sync-interval', verifyToken, (req, res) => {
    const { interval } = req.body;
    const query = 'UPDATE users SET sync_interval = ? WHERE id = ?';

    db.query(query, [interval, req.userId], (err, result) => {
        if (err) {
            console.error('Error storing sync interval:', err);
            return res.status(500).send('Error storing sync interval');
        }
        res.status(200).send('Sync interval stored successfully');
    });
});

// Add this endpoint after your other endpoints
app.post('/store-sync-interval', verifyToken, (req, res) => {
    const { interval } = req.body;
    const userId = req.userId; // This comes from the verifyToken middleware

    const query = 'UPDATE users SET sync_interval = ? WHERE id = ?';

    db.query(query, [interval, userId], (err, result) => {
        if (err) {
            console.error('Error storing sync interval:', err);
            return res.status(500).send('Error storing sync interval');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('User not found');
        }

        res.status(200).json({ message: 'Sync interval stored successfully' });
    });
});

// Update your existing user-data endpoint to include sync_interval
app.get('/user-data', verifyToken, (req, res) => {
    const query = 'SELECT id, username, email, sync_interval FROM users WHERE id = ?';

    db.query(query, [req.userId], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).send('Error fetching user data');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(results[0]);
    });
});

app.get('/user-data-for-context', verifyToken, (req, res) => {
    const userQuery = `
        SELECT name, age, profession, marital_status, height, weight,
        (SELECT GROUP_CONCAT(CONCAT(
            'Disease: ', disease_name, 
            ', Duration: ', duration_weeks, ' weeks',
            ', Medication: ', medication
        ) SEPARATOR '; ') 
        FROM health_conditions 
        WHERE user_id = users.id) as medical_history
        FROM users 
        WHERE id = ?`;

    db.query(userQuery, [req.userId], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).send('Error fetching user data');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        const userData = results[0];
        let contextString = `Name: ${userData.name}, Age: ${userData.age}, `;
        contextString += `Profession: ${userData.profession}, `;
        contextString += `Marital Status: ${userData.marital_status ? 'Married' : 'Single'}, `;
        contextString += `Height: ${userData.height}cm, Weight: ${userData.weight}kg.\n\n`;

        if (userData.medical_history) {
            contextString += "Medical History:\n" + userData.medical_history;
        } else {
            contextString += "No previous medical conditions recorded.";
        }

        res.status(200).json(contextString);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});