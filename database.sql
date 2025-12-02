CREATE DATABASE IF NOT EXISTS hr_chatbot_db;

USE hr_chatbot_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    daysoff INT DEFAULT 25,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payslips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    month VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    net_salary DECIMAL(10, 2),
    gross_salary DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Optional: Insert a test user (password: password123)
-- Note: In a real scenario, passwords should be hashed. The backend handles hashing.
-- This is just for structure reference.
