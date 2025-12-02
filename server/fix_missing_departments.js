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

  const updates = [
    { username: 'test', department: 'IT', post: 'Développeur' },
    { username: 'khalil', department: 'IT', post: 'Développeur' },
    { username: 'rh', department: 'RH', post: 'Responsable RH' }
  ];

  let completed = 0;

  updates.forEach(u => {
    const sql = 'UPDATE users SET department = ?, post = ? WHERE username = ?';
    connection.query(sql, [u.department, u.post, u.username], (err, result) => {
      if (err) console.error(`Error updating ${u.username}:`, err);
      else console.log(`Updated ${u.username}: ${result.affectedRows} rows`);
      
      completed++;
      if (completed === updates.length) {
        connection.end();
      }
    });
  });
});