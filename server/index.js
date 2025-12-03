const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Ensure leave_requests table exists
const createLeaveRequestsTable = `
CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  rejection_reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;

db.query(createLeaveRequestsTable, (err) => {
  if (err) console.error("Error creating leave_requests table:", err);
  else {
    console.log("leave_requests table ready");
    // Add rejection_reason column if it doesn't exist (for existing tables)
    const alterTableSql = "ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(255)";
    db.query(alterTableSql, (err) => {
      if (err) console.error("Error altering leave_requests table:", err);
    });
  }
});

// Ensure payslip_requests table exists
const createPayslipRequestsTable = `
CREATE TABLE IF NOT EXISTS payslip_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  rejection_reason VARCHAR(255),
  user_seen BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;

db.query(createPayslipRequestsTable, (err) => {
  if (err) console.error("Error creating payslip_requests table:", err);
  else {
    console.log("payslip_requests table ready");
    // Add user_seen column if it doesn't exist
    const alterSql = "ALTER TABLE payslip_requests ADD COLUMN IF NOT EXISTS user_seen BOOLEAN DEFAULT FALSE";
    db.query(alterSql, (err) => { if (err) console.error("Error altering payslip_requests:", err); });
  }
});

// Ensure leave_requests has user_seen
const alterLeaveRequestsTable = "ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS user_seen BOOLEAN DEFAULT FALSE";
db.query(alterLeaveRequestsTable, (err) => {
  if (err) console.error("Error adding user_seen to leave_requests:", err);
});

// Ensure users table has 'post' column
const alterUsersTable = "ALTER TABLE users ADD COLUMN IF NOT EXISTS post VARCHAR(100) DEFAULT 'Développeur'";
db.query(alterUsersTable, (err) => {
  if (err) console.error("Error adding post column to users:", err);
  else console.log("users table updated with post column");
});

// Ensure users table has 'base_salary' column
const alterUsersSalary = "ALTER TABLE users ADD COLUMN IF NOT EXISTS base_salary DECIMAL(10,2) DEFAULT 3200.00";
db.query(alterUsersSalary, (err) => {
  if (err) console.error("Error adding base_salary column to users:", err);
  else console.log("users table updated with base_salary column");
});

// Ensure absences table exists with status and reason
const createAbsencesTable = `
CREATE TABLE IF NOT EXISTS absences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  reason VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  rejection_reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;

db.query(createAbsencesTable, (err) => {
  if (err) console.error("Error creating absences table:", err);
  else {
    console.log("absences table ready");
    // Add status column if it doesn't exist (for existing tables)
    const alterAbsencesStatus = "ALTER TABLE absences ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'";
    db.query(alterAbsencesStatus, (err) => {
        if (err) console.error("Error adding status to absences:", err);
    });

    // Add rejection_reason column if it doesn't exist (for existing tables)
    const alterAbsencesReason = "ALTER TABLE absences ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(255)";
    db.query(alterAbsencesReason, (err) => {
        if (err) console.error("Error adding rejection_reason to absences:", err);
    });
  }
});

// Ensure payslips table exists and has data column
const createPayslipsTable = `
CREATE TABLE IF NOT EXISTS payslips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  month VARCHAR(20),
  year INT,
  net_salary DECIMAL(10,2),
  gross_salary DECIMAL(10,2),
  data TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;

db.query(createPayslipsTable, (err) => {
  if (err) console.error("Error creating payslips table:", err);
  else {
    console.log("payslips table ready");
    const alterPayslips = "ALTER TABLE payslips ADD COLUMN IF NOT EXISTS data TEXT";
    db.query(alterPayslips, (err) => { if (err) console.error("Error adding data to payslips:", err); });
  }
});

// Ensure clock_ins table exists
const createClockInsTable = `
CREATE TABLE IF NOT EXISTS clock_ins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  time_in TIME NOT NULL,
  time_out TIME,
  status VARCHAR(50) DEFAULT 'En cours',
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;

db.query(createClockInsTable, (err) => {
  if (err) console.error("Error creating clock_ins table:", err);
  else console.log("clock_ins table ready");
});

// Ensure accounting tables exist
const createClientsTable = `
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createClientsTable, (err) => {
  if (err) console.error("Error creating clients table:", err);
  else {
    console.log("clients table ready");
    // Seed Clients
    db.query('SELECT COUNT(*) as count FROM clients', (err, res) => {
      if (!err && res[0].count === 0) {
        const clients = [
          ['KYCE SARL', 'contact@kyce.tn', '+216 71 123 456', 'Les Berges du Lac 1, Tunis'],
          ['Global Consulting', 'info@globalconsulting.com', '+216 71 987 654', 'Centre Urbain Nord, Tunis'],
          ['StartUp Factory', 'hello@startupfactory.tn', '+216 55 000 111', 'La Marsa, Tunis'],
          ['Design Studio', 'contact@designstudio.tn', '+216 22 333 444', 'Sidi Bou Said, Tunis']
        ];
        db.query('INSERT INTO clients (name, email, phone, address) VALUES ?', [clients], (err) => {
          if (err) console.error("Error seeding clients:", err);
          else console.log("Seeded clients data");
        });
      }
    });
  }
});

const createInvoicesTable = `
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  date DATE NOT NULL,
  due_date DATE,
  status ENUM('Payé', 'Non payé', 'En retard') DEFAULT 'Non payé',
  total DECIMAL(10, 2) DEFAULT 0.00,
  tax DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
)`;

db.query(createInvoicesTable, (err) => {
  if (err) console.error("Error creating invoices table:", err);
  else {
    console.log("invoices table ready");
    // Seed Invoices (Wait a bit for clients to be ready in a real scenario, but here we assume sequential execution or retry)
    setTimeout(() => {
      db.query('SELECT COUNT(*) as count FROM invoices', (err, res) => {
        if (!err && res[0].count === 0) {
          // Assuming client IDs 1, 2, 3, 4 exist from seed
          const invoices = [
            [1, '2025-11-01', '2025-11-15', 'Payé', 5950.00, 950.00],
            [2, '2025-11-20', '2025-12-05', 'En retard', 3570.00, 570.00],
            [3, '2025-12-01', '2025-12-15', 'Non payé', 11900.00, 1900.00],
            [1, '2025-12-02', '2025-12-16', 'Non payé', 2380.00, 380.00],
            [4, '2025-10-15', '2025-10-30', 'Payé', 1785.00, 285.00]
          ];
          db.query('INSERT INTO invoices (client_id, date, due_date, status, total, tax) VALUES ?', [invoices], (err) => {
            if (err) console.error("Error seeding invoices:", err);
            else console.log("Seeded invoices data");
          });
        }
      });
    }, 1000);
  }
});

const createInvoiceItemsTable = `
CREATE TABLE IF NOT EXISTS invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) DEFAULT 0.00,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
)`;

db.query(createInvoiceItemsTable, (err) => {
  if (err) console.error("Error creating invoice_items table:", err);
  else {
    console.log("invoice_items table ready");
    // Ensure quantity column exists (for existing tables)
    const alterInvoiceItems = "ALTER TABLE invoice_items ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1";
    db.query(alterInvoiceItems, (err) => {
      if (err) console.error("Error adding quantity to invoice_items:", err);
      else console.log("invoice_items table updated with quantity column");
    });
  }
});

const createExpensesTable = `
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createExpensesTable, (err) => {
  if (err) console.error("Error creating expenses table:", err);
  else {
    console.log("expenses table ready");
    // Seed Expenses
    db.query('SELECT COUNT(*) as count FROM expenses', (err, res) => {
      if (!err && res[0].count === 0) {
        const expenses = [
          ['Achat Ordinateurs Dell XPS', 12500.00, '2025-11-05', 'Matériel'],
          ['Licence Adobe CC', 1200.00, '2025-11-10', 'Logiciel'],
          ['Loyer Bureau Décembre', 3500.00, '2025-12-01', 'Loyer'],
          ['Facture Internet Topnet', 150.00, '2025-12-02', 'Autre'],
          ['Fournitures de bureau', 450.00, '2025-11-25', 'Matériel'],
          ['Déjeuner Client', 250.00, '2025-11-28', 'Autre'],
          ['Hébergement Serveur AWS', 850.00, '2025-11-30', 'Logiciel']
        ];
        db.query('INSERT INTO expenses (description, amount, date, category) VALUES ?', [expenses], (err) => {
          if (err) console.error("Error seeding expenses:", err);
          else console.log("Seeded expenses data");
        });
      }
    });
  }
});

// Register Route
app.post('/register', async (req, res) => {
  const { username, password, post, registrationCode } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Security Check: Verify Registration Code
  const VALID_CODE = "RH2025"; // This should ideally be in an environment variable
  if (registrationCode !== VALID_CODE) {
    return res.status(403).json({ message: 'Code d\'inscription invalide. Contactez l\'administrateur.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Determine base salary based on post
    let baseSalary = 3200.00;
    if (post) {
        const p = post.toLowerCase();
        if (p.includes('manager')) baseSalary = 5000.00;
        else if (p.includes('rh') || p.includes('hr')) baseSalary = 4000.00;
        else if (p.includes('senior')) baseSalary = 4500.00;
        else if (p.includes('junior')) baseSalary = 2500.00;
    }

    // Default daysoff is 25 days
    const sql = 'INSERT INTO users (username, password, daysoff, post, base_salary) VALUES (?, ?, 25, ?, ?)';
    
    db.query(sql, [username, hashedPassword, post || 'Développeur', baseSalary], (err, result) => {
      if (err) {
        console.error("Database error during registration:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username already exists' });
        }
        return res.status(500).json({ message: 'Database error: ' + err.message });
      }
      
      // Automatically create a dummy payslip for the new user
      const newUserId = result.insertId;
      const payslipSql = "INSERT INTO payslips (user_id, month, year, net_salary, gross_salary) VALUES (?, 'November', 2025, ?, ?)";
      const netSalary = (baseSalary * 0.78).toFixed(2); // Approx 22% tax
      db.query(payslipSql, [newUserId, netSalary, baseSalary], (err) => {
        if (err) console.error("Error creating initial payslip:", err);
      });

      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Database error during login:", err);
      return res.status(500).json({ message: 'Database error: ' + err.message });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({ 
        message: 'Login successful', 
        user: { id: user.id, username: user.username, daysoff: user.daysoff, post: user.post } 
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Get Days Off Route
app.get('/daysoff/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT daysoff FROM users WHERE id = ?';
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching daysoff:", err);
      return res.status(500).json({ message: 'Database error: ' + err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ daysoff: results[0].daysoff });
  });
});

// Take Leave Route
app.post('/take-leave', (req, res) => {
  const { userId, days } = req.body;

  if (!userId || !days || days <= 0) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  // First check balance
  const checkSql = 'SELECT daysoff FROM users WHERE id = ?';
  db.query(checkSql, [userId], (err, results) => {
    if (err) {
      console.error("Error checking balance:", err);
      return res.status(500).json({ message: 'Database error (check): ' + err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentBalance = results[0].daysoff;
    if (currentBalance < days) {
      return res.status(400).json({ message: 'Insufficient leave balance', currentBalance });
    }

    // Update balance
    const updateSql = 'UPDATE users SET daysoff = daysoff - ? WHERE id = ?';
    db.query(updateSql, [days, userId], (err, result) => {
      if (err) {
        console.error("Error updating balance:", err);
        return res.status(500).json({ message: 'Database error (update): ' + err.message });
      }
      res.json({ message: 'Leave approved', newBalance: currentBalance - days });
    });
  });
});

// Get Payslip Route
app.get('/payslip/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(`[DEBUG] Fetching payslip for User ID: ${userId}`);

  // Get the latest payslip
  const sql = 'SELECT * FROM payslips WHERE user_id = ? ORDER BY year DESC, id DESC LIMIT 1';
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("[DEBUG] Database error fetching payslip:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    console.log(`[DEBUG] Query result count: ${results.length}`);
    
    if (results.length === 0) {
      console.log(`[DEBUG] No payslip found for user ${userId}`);
      return res.status(404).json({ message: `No payslip found for user ID ${userId}` });
    }
    res.json({ payslip: results[0] });
  });
});

// Report Absence Route
app.post('/absences', (req, res) => {
  console.log("[DEBUG] Received absence report request");
  const { userId, reason } = req.body;
  console.log(`[DEBUG] UserID: ${userId}, Reason: ${reason}`);
  
  const date = new Date().toISOString().slice(0, 10); // Current date YYYY-MM-DD

  if (!userId) {
    console.error("[DEBUG] Missing User ID");
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Explicitly set status to 'pending' to ensure it requires approval
  const sql = "INSERT INTO absences (user_id, date, reason, status) VALUES (?, ?, ?, 'pending')";
  db.query(sql, [userId, date, reason], (err, result) => {
    if (err) {
      console.error("[DEBUG] Database error recording absence:", err);
      return res.status(500).json({ message: 'Database error: ' + err.message });
    }
    console.log("[DEBUG] Absence recorded successfully as pending");
    res.status(201).json({ message: 'Absence recorded successfully' });
  });
});

// Get All Employees (For HR Dashboard)
app.get('/employees', (req, res) => {
  const sql = 'SELECT id, username, daysoff, created_at, department, post, base_salary FROM users';
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching employees:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// Get All Absences (For HR Dashboard)
app.get('/all-absences', (req, res) => {
  const sql = `
    SELECT a.id, a.date, a.reason, a.status, u.username 
    FROM absences a 
    JOIN users u ON a.user_id = u.id 
    ORDER BY a.date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all absences:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// Update Absence Status (Approve/Reject)
app.put('/api/absences/:id/status', (req, res) => {
  const absenceId = req.params.id;
  const { status, rejectionReason } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const sql = 'UPDATE absences SET status = ?, rejection_reason = ? WHERE id = ?';
  db.query(sql, [status, rejectionReason || null, absenceId], (err, result) => {
    if (err) {
      console.error("Error updating absence status:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ message: `Absence ${status}` });
  });
});

// --- Leave Request Management ---

// Check Leave Availability (Pre-check)
app.post('/api/check-leave-availability', (req, res) => {
  const { userId, startDate, endDate } = req.body;
  if (!userId || !startDate || !endDate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // 1. Check Balance
  const balanceSql = 'SELECT daysoff, post FROM users WHERE id = ?';
  db.query(balanceSql, [userId], (err, userResults) => {
    if (err || userResults.length === 0) return res.status(500).json({ message: 'User check failed' });
    
    const user = userResults[0];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (requestedDays > user.daysoff) {
      return res.status(400).json({ message: `Solde insuffisant. Vous demandez ${requestedDays} jours mais il ne vous en reste que ${user.daysoff}.` });
    }

    // 2. Check Role Conflict
    const conflictSql = `
      SELECT u.username 
      FROM leave_requests lr
      JOIN users u ON lr.user_id = u.id
      WHERE u.post = ? 
      AND u.id != ?
      AND lr.status = 'approved'
      AND (
        (lr.start_date <= ? AND lr.end_date >= ?) OR
        (lr.start_date <= ? AND lr.end_date >= ?) OR
        (lr.start_date >= ? AND lr.end_date <= ?)
      )
    `;
    
    // Ensure user.post is not undefined (use null if missing) to prevent driver crash
    const userPost = user.post !== undefined ? user.post : null;

    db.query(conflictSql, [userPost, userId, endDate, startDate, startDate, endDate, startDate, endDate], (err, conflictResults) => {
      if (err) {
        console.error("Conflict check error:", err);
        return res.status(500).json({ message: 'Conflict check failed' });
      }

      if (conflictResults.length > 0) {
        return res.status(409).json({ message: `Conflit de planning : ${conflictResults[0].username} (même poste) est déjà en congé sur cette période.` });
      }

      res.json({ message: 'Available' });
    });
  });
});

// Create Leave Request
app.post('/api/leave-requests', (req, res) => {
  const { userId, startDate, endDate, reason } = req.body;
  if (!userId || !startDate || !endDate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // 1. Check Balance
  const balanceSql = 'SELECT daysoff, post FROM users WHERE id = ?';
  db.query(balanceSql, [userId], (err, userResults) => {
    if (err || userResults.length === 0) return res.status(500).json({ message: 'User check failed' });
    
    const user = userResults[0];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (requestedDays > user.daysoff) {
      return res.status(400).json({ message: `Solde insuffisant. Vous demandez ${requestedDays} jours mais il ne vous en reste que ${user.daysoff}.` });
    }

    // 2. Check Role Conflict
    // Find other users with same post who have APPROVED leave overlapping with this request
    const conflictSql = `
      SELECT u.username 
      FROM leave_requests lr
      JOIN users u ON lr.user_id = u.id
      WHERE u.post = ? 
      AND u.id != ?
      AND lr.status = 'approved'
      AND (
        (lr.start_date <= ? AND lr.end_date >= ?) OR
        (lr.start_date <= ? AND lr.end_date >= ?) OR
        (lr.start_date >= ? AND lr.end_date <= ?)
      )
    `;
    
    // Ensure user.post is not undefined
    const userPost = user.post !== undefined ? user.post : null;
    db.query(conflictSql, [userPost, userId, endDate, startDate, startDate, endDate, startDate, endDate], (err, conflictResults) => {
      if (err) {
        console.error("Conflict check error:", err);
        return res.status(500).json({ message: 'Conflict check failed' });
      }

      if (conflictResults.length > 0) {
        return res.status(409).json({ message: `Conflit de planning : ${conflictResults[0].username} (même poste) est déjà en congé sur cette période.` });
      }

      // 3. Insert Request
      const sql = 'INSERT INTO leave_requests (user_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)';
      db.query(sql, [userId, startDate, endDate, reason], (err, result) => {
        if (err) {
          console.error("Error creating leave request:", err);
          return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'Leave request submitted successfully' });
      });
    });
  });
});

// Get All Leave Requests (For HR)
app.get('/api/leave-requests', (req, res) => {
  const sql = `
    SELECT lr.*, u.username 
    FROM leave_requests lr 
    JOIN users u ON lr.user_id = u.id 
    ORDER BY lr.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching leave requests:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// Get My Leave Requests (For Employee)
app.get('/api/my-leave-requests/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM leave_requests WHERE user_id = ? ORDER BY created_at DESC';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user leave requests:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// Update Leave Request Status (Approve/Reject)
app.put('/api/leave-requests/:id/status', (req, res) => {
  const requestId = req.params.id;
  const { status, rejectionReason } = req.body; // 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  // Start a transaction to ensure consistency
  db.beginTransaction(err => {
    if (err) return res.status(500).json({ message: 'Transaction error' });

    const updateSql = 'UPDATE leave_requests SET status = ?, rejection_reason = ? WHERE id = ?';
    db.query(updateSql, [status, rejectionReason || null, requestId], (err, result) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ message: 'Error updating status' }));
      }

      // If approved, deduct days from user balance
      if (status === 'approved') {
        // First get the request details to calculate days
        db.query('SELECT * FROM leave_requests WHERE id = ?', [requestId], (err, requests) => {
          if (err || requests.length === 0) {
            return db.rollback(() => res.status(500).json({ message: 'Request not found' }));
          }
          
          const request = requests[0];
          const start = new Date(request.start_date);
          const end = new Date(request.end_date);
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive

          const deductSql = 'UPDATE users SET daysoff = daysoff - ? WHERE id = ?';
          db.query(deductSql, [diffDays, request.user_id], (err) => {
            if (err) {
              return db.rollback(() => res.status(500).json({ message: 'Error updating balance' }));
            }
            
            db.commit(err => {
              if (err) return db.rollback(() => res.status(500).json({ message: 'Commit error' }));
              res.json({ message: 'Request approved and balance updated' });
            });
          });
        });
      } else {
        // If rejected, just commit
        db.commit(err => {
          if (err) return db.rollback(() => res.status(500).json({ message: 'Commit error' }));
          res.json({ message: 'Request rejected' });
        });
      }
    });
  });
});

// --- Payslip Requests Routes ---

// Create Payslip Request
app.post('/api/payslip-requests', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'User ID required' });

  const sql = 'INSERT INTO payslip_requests (user_id) VALUES (?)';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error creating payslip request:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Payslip request created', id: result.insertId });
  });
});

// Get All Payslip Requests (For HR)
app.get('/api/payslip-requests', (req, res) => {
  const sql = `
    SELECT pr.*, u.username 
    FROM payslip_requests pr 
    JOIN users u ON pr.user_id = u.id 
    ORDER BY pr.request_date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching payslip requests:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// Update Payslip Request Status
app.put('/api/payslip-requests/:id/status', (req, res) => {
  const requestId = req.params.id;
  const { status, rejectionReason } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const sql = 'UPDATE payslip_requests SET status = ?, rejection_reason = ? WHERE id = ?';
  db.query(sql, [status, rejectionReason || null, requestId], (err, result) => {
    if (err) {
      console.error("Error updating payslip request:", err);
      return res.status(500).json({ message: 'Database error' });
    }

    // If approved, generate a new payslip for the user
    if (status === 'approved') {
      // Get user_id from request
      db.query('SELECT user_id FROM payslip_requests WHERE id = ?', [requestId], (err, rows) => {
        if (!err && rows.length > 0) {
          const userId = rows[0].user_id;
          const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const d = new Date();
          const currentMonth = monthNames[d.getMonth()];
          const currentYear = d.getFullYear();

          // 1. Get User Base Salary and Info
          db.query('SELECT * FROM users WHERE id = ?', [userId], (err, userRows) => {
             if (err || userRows.length === 0) return;
             const user = userRows[0];
             const baseSalary = parseFloat(user.base_salary);

             // 2. Count Approved Absences for this month
             const absenceSql = `
                SELECT COUNT(*) as count 
                FROM absences 
                WHERE user_id = ? 
                AND status = 'approved' 
                AND MONTH(date) = ? 
                AND YEAR(date) = ?
             `;
             
             db.query(absenceSql, [userId, d.getMonth() + 1, currentYear], (err, absRows) => {
                if (err) return;
                const absenceCount = absRows[0].count;
                
                // 3. Calculate Detailed Salary
                const grossSalary = baseSalary;
                const cnssRate = 0.0918;
                const cnss = grossSalary * cnssRate;
                const taxableSalary = grossSalary - cnss;
                
                // Simplified IRPP (Progressive tax simulation - approx 15% effective rate for this range)
                const irpp = taxableSalary * 0.15; 
                const css = taxableSalary * 0.01; // Contribution Sociale Solidarité
                
                let sanction = 0;
                if (absenceCount > 2) {
                    sanction = 100;
                }

                const totalDeductions = cnss + irpp + css + sanction;
                const netSalary = grossSalary - totalDeductions;

                // Construct Full Payslip Data
                const payslipData = {
                    employee: {
                        name: user.username,
                        matricule: user.id.toString().padStart(6, '0'),
                        address: "123 Rue de la République, Tunis", // Fake
                        dob: "01/01/1990", // Fake
                        post: user.post || "Employé",
                        dept: "IT",
                        contract: "CDI",
                        hireDate: new Date(user.created_at).toLocaleDateString(),
                        familyStatus: "Célibataire",
                        children: 0,
                        paymentMode: "Virement"
                    },
                    employer: {
                        name: "Ben Yaacoub Company",
                        address: "Immeuble Yacoub, Centre Urbain Nord, Tunis",
                        matriculeFiscal: "1234567/A/M/000",
                        cnss: "87654321-99",
                        establishmentId: "001",
                        activityCode: "7220"
                    },
                    period: {
                        month: currentMonth,
                        year: currentYear,
                        daysWorked: 22 - absenceCount,
                        hoursWorked: 176,
                        overtimeHours: 0,
                        absences: absenceCount,
                        lateness: 0
                    },
                    salary: {
                        base: baseSalary.toFixed(2),
                        gross: grossSalary.toFixed(2),
                        primes: "0.00",
                        benefits: "0.00",
                        overtime: "0.00"
                    },
                    deductions: {
                        cnss: cnss.toFixed(2),
                        irpp: irpp.toFixed(2),
                        css: css.toFixed(2),
                        sanction: sanction.toFixed(2),
                        absences: "0.00" // Assuming sanction covers it or separate logic
                    },
                    summary: {
                        taxable: taxableSalary.toFixed(2),
                        netBeforeTax: (grossSalary - cnss).toFixed(2),
                        netToPay: netSalary.toFixed(2)
                    },
                    bank: {
                        name: "BIAT",
                        rib: "12345678901234567890",
                        date: new Date().toLocaleDateString()
                    }
                };

                // 4. Insert Payslip
                // Check if payslip already exists for this month
                db.query('SELECT * FROM payslips WHERE user_id = ? AND month = ? AND year = ?', [userId, currentMonth, currentYear], (err, existing) => {
                    if (!err && existing.length === 0) {
                       const insertPayslip = "INSERT INTO payslips (user_id, month, year, net_salary, gross_salary, data) VALUES (?, ?, ?, ?, ?, ?)";
                       db.query(insertPayslip, [userId, currentMonth, currentYear, netSalary.toFixed(2), grossSalary.toFixed(2), JSON.stringify(payslipData)], (err) => {
                         if (err) console.error("Error generating payslip:", err);
                         else console.log(`Payslip generated for user ${userId}. Absences: ${absenceCount}, Sanction: ${sanction}`);
                       });
                    }
                });
             });
          });
        }
      });
    }

    res.json({ message: `Request ${status}` });
  });
});

// Get User Notifications (Unseen Approved/Rejected requests)
app.get('/api/user-notifications/:userId', (req, res) => {
  const userId = req.params.userId;
  
  const leaveSql = "SELECT COUNT(*) as count FROM leave_requests WHERE user_id = ? AND status IN ('approved', 'rejected') AND user_seen = FALSE";
  const payslipSql = "SELECT COUNT(*) as count FROM payslip_requests WHERE user_id = ? AND status IN ('approved', 'rejected') AND user_seen = FALSE";

  db.query(leaveSql, [userId], (err, leaveRows) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    
    db.query(payslipSql, [userId], (err, payslipRows) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      
      res.json({
        leave_notifications: leaveRows[0].count,
        payslip_notifications: payslipRows[0].count
      });
    });
  });
});

// Mark Notifications as Seen
app.put('/api/mark-seen/:userId', (req, res) => {
  const userId = req.params.userId;
  const { type } = req.body; // 'leave' or 'payslip'

  let sql = "";
  if (type === 'leave') {
    sql = "UPDATE leave_requests SET user_seen = TRUE WHERE user_id = ? AND status IN ('approved', 'rejected')";
  } else if (type === 'payslip') {
    sql = "UPDATE payslip_requests SET user_seen = TRUE WHERE user_id = ? AND status IN ('approved', 'rejected')";
  } else {
    return res.status(400).json({ message: 'Invalid type' });
  }

  db.query(sql, [userId], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Marked as seen' });
  });
});

// Get My Payslips
app.get('/api/my-payslips/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM payslips WHERE user_id = ? ORDER BY year DESC, month DESC'; // Simple ordering
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching payslips:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// --- Clock-In/Out Routes ---

// Get Clock-Ins for User
app.get('/api/clock-ins/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM clock_ins WHERE user_id = ? ORDER BY date DESC, time_in DESC';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching clock-ins:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    // Format for frontend
    const formatted = results.map(r => ({
      id: r.id,
      employeeId: r.user_id,
      date: r.date.toISOString().split('T')[0], // YYYY-MM-DD
      in: r.time_in,
      out: r.time_out,
      status: r.status
    }));
    res.json(formatted);
  });
});

// Clock In
app.post('/api/clock-in', (req, res) => {
  const { userId } = req.body;
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toLocaleTimeString('fr-FR', { hour12: false }); // HH:MM:SS

  // Check if already clocked in today
  const checkSql = 'SELECT * FROM clock_ins WHERE user_id = ? AND date = ? AND time_out IS NULL';
  db.query(checkSql, [userId, date], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length > 0) return res.status(400).json({ message: 'Déjà pointé pour aujourd\'hui' });

    const sql = 'INSERT INTO clock_ins (user_id, date, time_in, status) VALUES (?, ?, ?, "En cours")';
    db.query(sql, [userId, date, time], (err, result) => {
      if (err) {
        console.error("Error clocking in:", err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(201).json({ message: 'Clock in successful', id: result.insertId, time });
    });
  });
});

// Clock Out
app.put('/api/clock-out', (req, res) => {
  const { userId } = req.body;
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toLocaleTimeString('fr-FR', { hour12: false });

  const sql = 'UPDATE clock_ins SET time_out = ?, status = "Présent" WHERE user_id = ? AND date = ? AND time_out IS NULL';
  db.query(sql, [time, userId, date], (err, result) => {
    if (err) {
      console.error("Error clocking out:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Aucun pointage en cours trouvé pour aujourd\'hui' });
    }
    res.json({ message: 'Clock out successful', time });
  });
});

// --- Accounting API Routes ---

// Clients
app.get('/api/clients', (req, res) => {
  db.query('SELECT * FROM clients ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/clients', (req, res) => {
  const { name, email, phone, address } = req.body;
  db.query('INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)', 
    [name, email, phone, address], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

app.put('/api/clients/:id', (req, res) => {
  const { name, email, phone, address } = req.body;
  db.query('UPDATE clients SET name=?, email=?, phone=?, address=? WHERE id=?', 
    [name, email, phone, address, req.params.id], 
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Client updated' });
    }
  );
});

app.delete('/api/clients/:id', (req, res) => {
  db.query('DELETE FROM clients WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Client deleted' });
  });
});

// Invoices
app.get('/api/invoices', (req, res) => {
  const sql = `
    SELECT i.*, c.name as client_name 
    FROM invoices i 
    JOIN clients c ON i.client_id = c.id 
    ORDER BY i.date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/invoices', (req, res) => {
  const { client_id, date, due_date, items } = req.body;
  
  // Calculate totals
  let total = 0;
  items.forEach(item => total += (item.quantity * item.unit_price));
  const tax = total * 0.19; // 19% VAT
  const grandTotal = total + tax;

  db.query('INSERT INTO invoices (client_id, date, due_date, total, tax, status) VALUES (?, ?, ?, ?, ?, "Non payé")', 
    [client_id, date, due_date, grandTotal, tax], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const invoiceId = result.insertId;
      const itemValues = items.map(item => [invoiceId, item.description, item.quantity, item.unit_price, item.quantity * item.unit_price]);
      
      if (itemValues.length > 0) {
        db.query('INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total) VALUES ?', [itemValues], (err) => {
          if (err) console.error("Error inserting items:", err);
        });
      }
      
      res.json({ message: 'Invoice created', id: invoiceId });
    }
  );
});

app.get('/api/invoices/:id', (req, res) => {
  const sql = `
    SELECT i.*, c.name as client_name, c.address as client_address, c.email as client_email, c.phone as client_phone 
    FROM invoices i 
    JOIN clients c ON i.client_id = c.id 
    WHERE i.id = ?
  `;
  
  db.query(sql, [req.params.id], (err, invoiceResult) => {
    if (err) return res.status(500).json({ error: err.message });
    if (invoiceResult.length === 0) return res.status(404).json({ message: 'Invoice not found' });
    
    db.query('SELECT * FROM invoice_items WHERE invoice_id = ?', [req.params.id], (err, itemsResult) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...invoiceResult[0], items: itemsResult });
    });
  });
});

app.put('/api/invoices/:id/status', (req, res) => {
  const { status } = req.body;
  db.query('UPDATE invoices SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status updated' });
  });
});

// Expenses
app.get('/api/expenses', (req, res) => {
  db.query('SELECT * FROM expenses ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/expenses', (req, res) => {
  const { description, amount, date, category } = req.body;
  db.query('INSERT INTO expenses (description, amount, date, category) VALUES (?, ?, ?, ?)', 
    [description, amount, date, category], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

app.delete('/api/expenses/:id', (req, res) => {
  db.query('DELETE FROM expenses WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Expense deleted' });
  });
});

// Dashboard Stats
app.get('/api/accounting/stats', (req, res) => {
  const stats = { income: 0, expenses: 0, net: 0, pendingInvoices: 0 };
  
  db.query('SELECT SUM(total) as income FROM invoices WHERE status = "Payé"', (err, result) => {
    if (!err && result[0].income) stats.income = parseFloat(result[0].income);
    
    db.query('SELECT SUM(amount) as expenses FROM expenses', (err, result) => {
      if (!err && result[0].expenses) stats.expenses = parseFloat(result[0].expenses);
      
      stats.net = stats.income - stats.expenses;
      
      db.query('SELECT COUNT(*) as count FROM invoices WHERE status = "En retard"', (err, result) => {
        if (!err) stats.pendingInvoices = result[0].count;
        res.json(stats);
      });
    });
  });
});

// Full Accounting Data for Reports
app.get('/api/accounting/reports/data', (req, res) => {
  const data = { invoices: [], expenses: [], payslips: [], clients: [] };

  const p1 = new Promise((resolve) => {
    db.query('SELECT i.*, c.name as client_name FROM invoices i JOIN clients c ON i.client_id = c.id', (err, res) => {
      if (!err) data.invoices = res;
      resolve();
    });
  });

  const p2 = new Promise((resolve) => {
    db.query('SELECT * FROM expenses', (err, res) => {
      if (!err) data.expenses = res;
      resolve();
    });
  });

  const p3 = new Promise((resolve) => {
    db.query('SELECT * FROM payslips', (err, res) => {
      if (!err) data.payslips = res;
      resolve();
    });
  });

  const p4 = new Promise((resolve) => {
    db.query('SELECT * FROM clients', (err, res) => {
      if (!err) data.clients = res;
      resolve();
    });
  });

  Promise.all([p1, p2, p3, p4]).then(() => {
    res.json(data);
  });
});

// Seed Additional Invoices with Quantities
setTimeout(() => {
  db.query('SELECT COUNT(*) as count FROM invoices', (err, res) => {
    if (!err && res[0].count <= 5) { // Only if we have the initial batch or less
      console.log("Seeding additional invoices with quantities...");
      
      const newInvoices = [
        { 
          client_id: 2, 
          date: '2025-12-04', 
          due_date: '2025-12-18', 
          items: [
            { description: 'Licence Antivirus (Poste)', quantity: 50, unit_price: 45.00 },
            { description: 'Installation & Config', quantity: 10, unit_price: 150.00 }
          ]
        },
        { 
          client_id: 3, 
          date: '2025-12-05', 
          due_date: '2025-12-20', 
          items: [
            { description: 'Serveur Rack Dell PowerEdge', quantity: 2, unit_price: 12500.00 },
            { description: 'Baie de stockage', quantity: 1, unit_price: 8000.00 },
            { description: 'Câblage Réseau (Mètre)', quantity: 500, unit_price: 2.50 }
          ]
        },
        {
          client_id: 1,
          date: '2025-12-06',
          due_date: '2025-12-21',
          items: [
            { description: 'Consulting Senior (Jours)', quantity: 5, unit_price: 850.00 },
            { description: 'Consulting Junior (Jours)', quantity: 10, unit_price: 450.00 }
          ]
        }
      ];

      newInvoices.forEach(inv => {
        let total = 0;
        inv.items.forEach(item => total += (item.quantity * item.unit_price));
        const tax = total * 0.19;
        const grandTotal = total + tax;

        db.query('INSERT INTO invoices (client_id, date, due_date, total, tax, status) VALUES (?, ?, ?, ?, ?, "Non payé")', 
          [inv.client_id, inv.date, inv.due_date, grandTotal, tax], 
          (err, result) => {
            if (!err) {
              const invoiceId = result.insertId;
              const itemValues = inv.items.map(item => [invoiceId, item.description, item.quantity, item.unit_price, item.quantity * item.unit_price]);
              db.query('INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total) VALUES ?', [itemValues], (err) => {
                if (err) console.error("Error inserting extra items:", err);
                else console.log(`Added extra invoice ${invoiceId} with quantities`);
              });
            } else {
              console.error("Error seeding extra invoice:", err);
            }
          }
        );
      });
    }
  });
}, 3000); // Wait for initial seed

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
