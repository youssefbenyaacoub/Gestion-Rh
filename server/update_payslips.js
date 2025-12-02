const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hr_chatbot_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to database.');

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
    } else {
      console.log('Table payslips created successfully.');
      
      // Insert dummy data for ALL users who don't have a payslip
      connection.query('SELECT id FROM users', (err, users) => {
        if (!err && users.length > 0) {
            users.forEach(user => {
                const userId = user.id;
                // Check if user already has a payslip
                connection.query('SELECT id FROM payslips WHERE user_id = ?', [userId], (err, results) => {
                    if (!err && results.length === 0) {
                        const insertQuery = `
                            INSERT INTO payslips (user_id, month, year, net_salary, gross_salary) 
                            VALUES (?, 'November', 2025, 2500.00, 3200.00)
                        `;
                        connection.query(insertQuery, [userId], (err) => {
                            if (!err) console.log(`Inserted dummy payslip for user ID ${userId}`);
                        });
                    } else {
                        console.log(`User ID ${userId} already has a payslip.`);
                    }
                });
            });
            // Give it a moment to finish async queries before closing (simple approach for script)
            setTimeout(() => {
                console.log('Finished checking/updating payslips.');
                connection.end();
            }, 1000);
        } else {
            console.log('No users found.');
            connection.end();
        }
      });
    }
  });
});
