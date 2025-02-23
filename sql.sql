-- Create the database
CREATE DATABASE health_dashboard;

-- Use the database
USE health_dashboard;

-- Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    profession VARCHAR(255) NOT NULL,
    marital_status BOOLEAN NOT NULL,
    height INT NOT NULL,
    weight INT NOT NULL
);

-- Create the health_conditions table
CREATE TABLE health_conditions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    disease_name VARCHAR(255) NOT NULL,
    duration_weeks INT NOT NULL,
    medication VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the wearable_data table
CREATE TABLE wearable_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    csv_file_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert dummy data into users table
INSERT INTO users (name, email, password, age, profession, marital_status, height, weight)
VALUES
('John Doe', 'john@example.com', 'password123', 30, 'Engineer', TRUE, 180, 75),
('Jane Smith', 'jane@example.com', 'password456', 28, 'Doctor', FALSE, 165, 60);

-- Insert dummy data into health_conditions table
INSERT INTO health_conditions (user_id, disease_name, duration_weeks, medication, image_url)
VALUES
(1, 'Diabetes', 52, 'Metformin', 'https://example.com/images/diabetes.jpg'),
(1, 'Hypertension', 26, 'Lisinopril', NULL),
(2, 'Asthma', 12, 'Albuterol', 'https://example.com/images/asthma.jpg');

-- Insert dummy data into wearable_data table
INSERT INTO wearable_data (user_id, csv_file_url)
VALUES
(1, 'https://example.com/data/john_steps.csv'),
(2, 'https://example.com/data/jane_steps.csv');




-- Create the patient_data table
CREATE TABLE patient_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    timestamp DATETIME NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    weight FLOAT NOT NULL,
    height FLOAT NOT NULL,
    bmi FLOAT NOT NULL,
    heart_rate FLOAT NOT NULL,
    bp_systolic FLOAT NOT NULL,
    bp_diastolic FLOAT NOT NULL,
    spo2 FLOAT NOT NULL,
    respiration_rate FLOAT NOT NULL,
    body_temperature FLOAT NOT NULL,
    blood_glucose FLOAT NOT NULL,
    activity_level INT NOT NULL,
    sleep_pattern INT NOT NULL
);