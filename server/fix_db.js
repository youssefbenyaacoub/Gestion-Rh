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

  // Check columns in users table
  connection.query("SHOW COLUMNS FROM users LIKE 'daysoff'", (err, results) => {
    if (err) {
      console.error('Error checking columns:', err);
      process.exit(1);
    }

    if (results.length > 0) {
      console.log("Column 'daysoff' already exists. No changes needed.");
      connection.end();
    } else {
      // Check for leave_balance
      connection.query("SHOW COLUMNS FROM users LIKE 'leave_balance'", (err, results) => {
        if (results.length > 0) {
          console.log("Found old column 'leave_balance'. Renaming to 'daysoff'...");
          connection.query("ALTER TABLE users CHANGE leave_balance daysoff INT DEFAULT 25", (err) => {
            if (err) {
              console.error("Error renaming column:", err);
            } else {
              console.log("Successfully renamed 'leave_balance' to 'daysoff'.");
            }
            connection.end();
          });
        } else {
          console.log("Column 'daysoff' missing. Adding it...");
          connection.query("ALTER TABLE users ADD COLUMN daysoff INT DEFAULT 25", (err) => {
            if (err) {
              console.error("Error adding column:", err);
            } else {
              console.log("Successfully added 'daysoff' column.");
            }
            connection.end();
          });
        }
      });
    }
  });
});
