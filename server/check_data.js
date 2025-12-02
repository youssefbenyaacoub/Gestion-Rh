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

  connection.query('SELECT * FROM users', (err, users) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Users found:', users.length);
    console.table(users);

    connection.query('SELECT * FROM payslips', (err, payslips) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Payslips found:', payslips.length);
            console.table(payslips);
        }
        connection.end();
    });
  });
});
