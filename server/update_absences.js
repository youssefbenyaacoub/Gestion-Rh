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

  const createAbsencesTableQuery = `
    CREATE TABLE IF NOT EXISTS absences (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      date DATE NOT NULL,
      reason TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;

  connection.query(createAbsencesTableQuery, (err) => {
    if (err) {
      console.error('Error creating table absences:', err);
    } else {
      console.log('Table absences created successfully.');
    }
    connection.end();
  });
});
