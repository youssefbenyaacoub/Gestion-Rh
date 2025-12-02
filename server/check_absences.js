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

  connection.query('DESCRIBE absences', (err, results) => {
    if (err) {
      console.error('Error describing table absences:', err);
    } else {
      console.log('Table absences structure:');
      console.table(results);
    }
    
    // Check if any absences are recorded
    connection.query('SELECT * FROM absences', (err, rows) => {
        if (err) console.error(err);
        else {
            console.log('Current absences records:', rows.length);
            console.table(rows);
        }
        connection.end();
    });
  });
});
