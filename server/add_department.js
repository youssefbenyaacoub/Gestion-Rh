const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hr_chatbot_db'
});

const userDepartments = [
    { username: "Ahmed Ben Ali", department: "IT" },
    { username: "Sarra Trabelsi", department: "IT" },
    { username: "Mohamed Dridi", department: "Produit" },
    { username: "Leila Jlassi", department: "RH" },
    { username: "Youssef Gharbi", department: "Finance" },
    { username: "Amel Bouazizi", department: "Marketing" },
    { username: "Karim Saidi", department: "Vente" },
    { username: "Nour El Houda", department: "IT" },
    { username: "Walid Tounsi", department: "Logistique" },
    { username: "Imen Mansouri", department: "Direction" },
    { username: "Omar Khelil", department: "IT" },
    { username: "Fatma Zahra", department: "Produit" },
    { username: "Mehdi Ben Amor", department: "IT" },
    { username: "Rym Chebbi", department: "Finance" },
    { username: "Hassen Mabrouk", department: "Logistique" },
    { username: "Sonia Ayari", department: "RH" },
    { username: "Khaled Hammami", department: "Produit" },
    { username: "Mouna Ben Salem", department: "Marketing" },
    { username: "Anis Jaziri", department: "Vente" },
    { username: "Hela Oueslati", department: "RH" },
    { username: "Bilel Mejri", department: "IT" },
    { username: "Ines Ghorbel", department: "Finance" },
    { username: "Sami Chaouachi", department: "Logistique" },
    { username: "Nadia Ferjani", department: "RH" },
    { username: "Lotfi Ben Youssef", department: "Direction" },
    { username: "Meriem Trad", department: "IT" },
    { username: "Fares Bouhlel", department: "Vente" },
    { username: "Salma Rekik", department: "Marketing" },
    { username: "Zied Mhadhbi", department: "IT" },
    { username: "Amina Zargouni", department: "RH" }
];

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to database.');

  // Add department column if it doesn't exist
  const addColumnQuery = "ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'N/A'";
  
  connection.query(addColumnQuery, (err) => {
    if (err) {
      console.error('Error adding department column:', err);
      connection.end();
      return;
    }
    console.log('Column department added or already exists.');

    // Update users with departments
    let updatesCompleted = 0;
    
    userDepartments.forEach(user => {
        const updateQuery = "UPDATE users SET department = ? WHERE username = ?";
        connection.query(updateQuery, [user.department, user.username], (err, result) => {
            if (err) {
                console.error(`Error updating department for ${user.username}:`, err);
            } else {
                // console.log(`Updated ${user.username} with department ${user.department}`);
            }
            
            updatesCompleted++;
            if (updatesCompleted === userDepartments.length) {
                console.log('All users updated with departments.');
                connection.end();
            }
        });
    });
  });
});
