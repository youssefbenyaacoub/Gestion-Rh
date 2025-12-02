const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hr_chatbot_db'
});

const usersData = [
    { username: "Ahmed Ben Ali", role: "Développeur Fullstack", daysoff: 12, created_at: "2023-01-15 00:00:00", salary: 3500 },
    { username: "Sarra Trabelsi", role: "Data Scientist", daysoff: 18, created_at: "2023-03-10 00:00:00", salary: 4200 },
    { username: "Mohamed Dridi", role: "Product Manager", daysoff: 8, created_at: "2022-11-05 00:00:00", salary: 4500 },
    { username: "Leila Jlassi", role: "Responsable RH", daysoff: 15, created_at: "2021-06-20 00:00:00", salary: 3800 },
    { username: "Youssef Gharbi", role: "Comptable", daysoff: 10, created_at: "2023-09-01 00:00:00", salary: 2800 },
    { username: "Amel Bouazizi", role: "Marketing Manager", daysoff: 14, created_at: "2022-02-15 00:00:00", salary: 4000 },
    { username: "Karim Saidi", role: "Commercial", daysoff: 12, created_at: "2023-05-10 00:00:00", salary: 2500 },
    { username: "Nour El Houda", role: "Développeur Frontend", daysoff: 11, created_at: "2023-08-20 00:00:00", salary: 3200 },
    { username: "Walid Tounsi", role: "Chauffeur", daysoff: 20, created_at: "2020-01-10 00:00:00", salary: 1500 },
    { username: "Imen Mansouri", role: "Assistante de Direction", daysoff: 16, created_at: "2021-11-15 00:00:00", salary: 2200 },
    { username: "Omar Khelil", role: "Développeur Backend", daysoff: 13, created_at: "2023-02-01 00:00:00", salary: 3400 },
    { username: "Fatma Zahra", role: "Designer UX/UI", daysoff: 14, created_at: "2022-07-01 00:00:00", salary: 3600 },
    { username: "Mehdi Ben Amor", role: "Technicien Support", daysoff: 10, created_at: "2023-10-15 00:00:00", salary: 2000 },
    { username: "Rym Chebbi", role: "Responsable Financier", daysoff: 18, created_at: "2019-05-20 00:00:00", salary: 5000 },
    { username: "Hassen Mabrouk", role: "Magasinier", daysoff: 22, created_at: "2018-03-10 00:00:00", salary: 1600 },
    { username: "Sonia Ayari", role: "Chargée de Recrutement", daysoff: 12, created_at: "2023-06-01 00:00:00", salary: 2600 },
    { username: "Khaled Hammami", role: "Chef de Projet", daysoff: 15, created_at: "2021-09-15 00:00:00", salary: 4800 },
    { username: "Mouna Ben Salem", role: "Community Manager", daysoff: 12, created_at: "2023-04-20 00:00:00", salary: 2400 },
    { username: "Anis Jaziri", role: "Commercial Senior", daysoff: 14, created_at: "2020-11-01 00:00:00", salary: 3000 },
    { username: "Hela Oueslati", role: "Juriste", daysoff: 16, created_at: "2022-01-10 00:00:00", salary: 3500 },
    { username: "Bilel Mejri", role: "DevOps Engineer", daysoff: 12, created_at: "2023-02-20 00:00:00", salary: 4000 },
    { username: "Ines Ghorbel", role: "Analyste Financier", daysoff: 13, created_at: "2022-10-05 00:00:00", salary: 3200 },
    { username: "Sami Chaouachi", role: "Responsable Logistique", daysoff: 18, created_at: "2019-08-15 00:00:00", salary: 3800 },
    { username: "Nadia Ferjani", role: "Assistante RH", daysoff: 10, created_at: "2023-11-01 00:00:00", salary: 1800 },
    { username: "Lotfi Ben Youssef", role: "Directeur Général", daysoff: 25, created_at: "2015-01-01 00:00:00", salary: 8000 },
    { username: "Meriem Trad", role: "Développeur Mobile", daysoff: 12, created_at: "2023-05-15 00:00:00", salary: 3300 },
    { username: "Fares Bouhlel", role: "Commercial Junior", daysoff: 10, created_at: "2023-12-01 00:00:00", salary: 1800 },
    { username: "Salma Rekik", role: "Responsable Communication", daysoff: 14, created_at: "2021-04-10 00:00:00", salary: 3700 },
    { username: "Zied Mhadhbi", role: "Administrateur Système", daysoff: 12, created_at: "2022-09-20 00:00:00", salary: 3100 },
    { username: "Amina Zargouni", role: "Stagiaire RH", daysoff: 0, created_at: "2024-01-02 00:00:00", salary: 800 }
];

connection.connect(async (err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to database.');

  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const values = usersData.map(u => [
      u.username, 
      hashedPassword, 
      u.daysoff, 
      u.created_at, 
      u.role, 
      u.salary
    ]);

    const sql = "INSERT INTO users (username, password, daysoff, created_at, post, base_salary) VALUES ?";
    
    connection.query(sql, [values], (err, result) => {
      if (err) {
        console.error('Error inserting users:', err);
      } else {
        console.log(`Successfully inserted ${result.affectedRows} users.`);
      }
      connection.end();
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    connection.end();
  }
});
