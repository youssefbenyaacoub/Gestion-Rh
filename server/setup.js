const mysql = require('mysql2');

// Connect to MySQL server (without specifying database yet)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    console.log('Please make sure XAMPP/WAMP is running and MySQL is started.');
    process.exit(1);
  }
  console.log('Connected to MySQL server.');

  // Create Database
  connection.query('CREATE DATABASE IF NOT EXISTS hr_chatbot_db', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      process.exit(1);
    }
    console.log('Database hr_chatbot_db created or already exists.');

    // Use the database
    connection.changeUser({ database: 'hr_chatbot_db' }, (err) => {
      if (err) {
        console.error('Error switching to database:', err);
        process.exit(1);
      }

      // Create Users Table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          daysoff INT DEFAULT 25,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      connection.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating table users:', err);
          process.exit(1);
        }
        console.log('Table users created or already exists.');

        // Create Payslips Table
        const createPayslipsTableQuery = `
          CREATE TABLE IF NOT EXISTS payslips (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            month VARCHAR(20) NOT NULL,
            year INT NOT NULL,
            net_salary DECIMAL(10, 2),
            gross_salary DECIMAL(10, 2),
            FOREIGN KEY (user_id) REFERENCES users(id)
          )
        `;

        connection.query(createPayslipsTableQuery, (err) => {
          if (err) {
            console.error('Error creating table payslips:', err);
            process.exit(1);
          }
          console.log('Table payslips created or already exists.');
          
          console.log('Setup complete! You can now start the server with "npm start".');
          connection.end();
        });
      });
    });
  });
});
