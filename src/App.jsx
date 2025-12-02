import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import ChatWindow from './components/ChatWindow';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [absences, setAbsences] = useState([]);
  const [payrollData, setPayrollData] = useState([
    { id: 1, employeeId: 1, month: "Décembre", year: 2025, baseSalary: 45000, hoursWorked: 151, overtime: 0, bonuses: 0, status: "Pending" },
    { id: 2, employeeId: 2, month: "Décembre", year: 2025, baseSalary: 52000, hoursWorked: 151, overtime: 5, bonuses: 200, status: "Pending" },
    { id: 3, employeeId: 3, month: "Décembre", year: 2025, baseSalary: 55000, hoursWorked: 160, overtime: 10, bonuses: 500, status: "Validated" }
  ]);
  const [trainings, setTrainings] = useState([
    { id: 1, title: "Sécurité Incendie", type: "Obligatoire", duration: "1 jour", participants: [1, 2], status: "Planifié", date: "2025-12-15" },
    { id: 2, title: "React Avancé", type: "Technique", duration: "3 jours", participants: [1], status: "En cours", date: "2025-12-10" },
    { id: 3, title: "Management d'équipe", type: "Soft Skills", duration: "2 jours", participants: [3], status: "Terminé", date: "2025-11-20" }
  ]);
  const [evaluations, setEvaluations] = useState([
    { id: 1, employeeId: 1, type: "Annuel", year: 2025, status: "Planifié", date: "2025-12-20", reviewer: "Admin", goals: ["Améliorer React", "Mentorer junior"], feedback: [] },
    { id: 2, employeeId: 2, type: "Trimestriel", year: 2025, status: "En cours", date: "2025-12-10", reviewer: "Admin", goals: ["Optimiser modèles ML"], feedback: ["Bon début"] },
    { id: 3, employeeId: 3, type: "Annuel", year: 2024, status: "Terminé", date: "2024-12-15", reviewer: "Admin", goals: ["Lancer v2.0"], feedback: ["Excellent travail", "Objectifs atteints"] }
  ]);
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('posts');
    return savedPosts ? JSON.parse(savedPosts) : [
      { id: 1, author: "Direction", content: "Bienvenue à tous pour cette nouvelle année 2026 ! 🎉", date: "2026-01-02", likes: 12, comments: [] },
      { id: 2, author: "Comité d'entreprise", content: "Soirée d'été prévue le 15 juillet. Inscrivez-vous !", date: "2025-06-01", likes: 25, comments: ["Super !", "Je serai là"] }
    ];
  });

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);
  const [polls, setPolls] = useState([
    { id: 1, question: "Destination du prochain Team Building ?", options: ["Montagne", "Plage", "Campagne"], votes: { "Montagne": 5, "Plage": 12, "Campagne": 3 }, active: true }
  ]);
  const [issues, setIssues] = useState([
    { id: 1, type: "Matériel", description: "Machine à café en panne au 2ème étage", status: "En cours", date: "2025-12-01" }
  ]);
  const [disciplinaryCases, setDisciplinaryCases] = useState([
    { id: 1, employeeId: 2, type: "Comportement", description: "Altercation verbale avec un collègue", date: "2025-11-28", status: "En cours", severity: "Moyenne", actions: [{ date: "2025-11-29", type: "Entretien", description: "Entretien préalable réalisé" }] },
    { id: 2, employeeId: 1, type: "Retard", description: "Retards répétés (3 fois cette semaine)", date: "2025-12-01", status: "Nouveau", severity: "Faible", actions: [] }
  ]);
  const [clockIns, setClockIns] = useState([
    { id: 1, employeeId: 1, date: "2025-12-01", in: "08:55", out: "18:05", status: "Présent" },
    { id: 2, employeeId: 2, date: "2025-12-02", in: "09:45", out: null, status: "En cours" },
    { id: 3, employeeId: 3, date: "2025-12-02", in: "08:45", out: "17:30", status: "Présent" },
    { id: 4, employeeId: 4, date: "2025-12-02", in: "09:00", out: "17:00", status: "Présent" }
  ]);
  const [schedules] = useState([
    { id: 1, employeeId: 1, week: "2025-W49", monday: "09:00-18:00", tuesday: "09:00-18:00", wednesday: "09:00-18:00", thursday: "09:00-18:00", friday: "09:00-17:00" },
    { id: 2, employeeId: 2, week: "2025-W49", monday: "09:30-18:30", tuesday: "09:30-18:30", wednesday: "Remote", thursday: "09:30-18:30", friday: "09:30-17:30" }
  ]);
  const [events] = useState([
    { id: 1, title: "Town Hall Q1", date: "2026-01-15", type: "Réunion", location: "Salle Conférence A" },
    { id: 2, title: "Team Building Cuisine", date: "2026-02-20", type: "Activité", location: "Atelier des Chefs" },
    { id: 3, title: "Hackathon Interne", date: "2026-03-10", type: "Innovation", location: "Campus Tech" }
  ]);
  const [resources] = useState([
    { id: 1, title: "Livret d'accueil", type: "PDF", size: "2.5 MB", date: "2025-01-01" },
    { id: 2, title: "Règlement Intérieur", type: "PDF", size: "1.2 MB", date: "2024-06-15" },
    { id: 3, title: "Charte Informatique", type: "PDF", size: "0.8 MB", date: "2024-09-01" },
    { id: 4, title: "Modèle Note de Frais", type: "XLSX", size: "0.5 MB", date: "2025-01-01" }
  ]);
  const [benefits, setBenefits] = useState([
    { id: 1, name: "Ticket Restaurant", amount: "8 DT / jour", type: "Repas", beneficiaries: "Tous" },
    { id: 2, name: "Assurance Santé", amount: "100% Prise en charge", type: "Santé", beneficiaries: "Tous" },
    { id: 3, name: "Prime Transport", amount: "50 DT / mois", type: "Transport", beneficiaries: "Tous" }
  ]);
  const [salaryGrids] = useState([
    { id: 1, role: "Junior", min: 2500, max: 3500, currency: "DT" },
    { id: 2, role: "Confirmé", min: 3500, max: 5000, currency: "DT" },
    { id: 3, role: "Senior", min: 5000, max: 7500, currency: "DT" },
    { id: 4, role: "Lead", min: 7500, max: 10000, currency: "DT" }
  ]);
  const [marketData] = useState([
    { role: "Développeur Fullstack", avg: 4800, companyAvg: 4500, diff: -6.25 },
    { role: "Data Scientist", avg: 5000, companyAvg: 5200, diff: 4.00 },
    { role: "Product Manager", avg: 5300, companyAvg: 5500, diff: 3.77 }
  ]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payslipRequests, setPayslipRequests] = useState([]);
  const [myPayslips, setMyPayslips] = useState([]);
  const [notifications, setNotifications] = useState({ leave: 0, payslip: 0 });
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  // Recruitment State
  const [jobOffers, setJobOffers] = useState([
    { id: 1, title: "Développeur Frontend Senior", dept: "Engineering", type: "CDI", candidates: 5, status: "Active", location: "Paris" },
    { id: 2, title: "Product Designer", dept: "Design", type: "CDI", candidates: 3, status: "Active", location: "Télétravail" },
    { id: 3, title: "Stagiaire Marketing", dept: "Marketing", type: "Stage", candidates: 4, status: "Active", location: "Lyon" }
  ]);

  // SST State
  const [accidents] = useState([
    { id: 1, employeeId: 2, date: "2025-11-15", type: "Chute", description: "Glissade dans les escaliers", severity: "Moyenne", status: "Clôturé", documents: ["rapport_accident.pdf"] },
    { id: 2, employeeId: 3, date: "2025-12-01", type: "Trajet", description: "Accident de voiture trajet domicile-travail", severity: "Faible", status: "En cours", documents: [] }
  ]);
  const [medicalVisits] = useState([
    { id: 1, employeeId: 1, date: "2025-12-10", type: "Visite périodique", status: "Planifié" },
    { id: 2, employeeId: 4, date: "2025-11-20", type: "Reprise", status: "Effectué", result: "Apte" }
  ]);
  const [risks] = useState([
    { id: 1, category: "Ergonomie", description: "Travail sur écran prolongé", probability: "Haute", impact: "Faible", mitigation: "Sièges ergonomiques, pauses régulières" },
    { id: 2, category: "Psychosocial", description: "Stress lié aux deadlines", probability: "Moyenne", impact: "Moyenne", mitigation: "Formation gestion du stress, équilibrage charge" }
  ]);
  const [safetyTrainings] = useState([
    { id: 1, title: "Gestes et Postures", date: "2025-12-05", participants: [1, 2, 3], status: "Planifié" },
    { id: 2, title: "Évacuation Incendie", date: "2025-10-15", participants: "Tous", status: "Effectué" }
  ]);

  const [selectedDept, setSelectedDept] = useState('All');

  const [candidates, setCandidates] = useState([
    { id: 1, name: "Sophie Martin", role: "Product Designer", date: "2023-12-01", status: "Nouveau", cv: "cv_sophie.pdf", atsScore: null, onboarding: { contract: false, equipment: false, account: false, training: false } },
    { id: 2, name: "Thomas Dubois", role: "Dev Frontend", date: "2023-11-30", status: "Entretien", cv: "cv_thomas.pdf", atsScore: 85, onboarding: { contract: false, equipment: false, account: false, training: false } },
    { id: 3, name: "Lucas Bernard", role: "Dev Frontend", date: "2023-11-28", status: "Rejeté", cv: "cv_lucas.pdf", atsScore: 45, onboarding: { contract: false, equipment: false, account: false, training: false } },
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Modal States for Recruitment
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editJobTitle, setEditJobTitle] = useState('');

  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [cvCandidate, setCvCandidate] = useState(null);

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contractCandidate, setContractCandidate] = useState(null);

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');

  const [isRecruitModalOpen, setIsRecruitModalOpen] = useState(false);

  // Modal States for Employee Management
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editEmployeeRole, setEditEmployeeRole] = useState('');
  const [editEmployeeDept, setEditEmployeeDept] = useState('');

  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [docEmployee, setDocEmployee] = useState(null);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('Autre');

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadDocName, setDownloadDocName] = useState('');

  // Modal States for Requests (Leave & Payslip)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectRequestId, setRejectRequestId] = useState(null);
  const [rejectRequestType, setRejectRequestType] = useState(''); // 'leave' or 'payslip'
  const [rejectReason, setRejectReason] = useState('');

  // Modal States for Training
  const [isTrainingNeedModalOpen, setIsTrainingNeedModalOpen] = useState(false);
  const [newTrainingNeed, setNewTrainingNeed] = useState('');

  const [isNewTrainingModalOpen, setIsNewTrainingModalOpen] = useState(false);
  const [newTrainingTitle, setNewTrainingTitle] = useState('');

  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false);
  const [trainingToAddTo, setTrainingToAddTo] = useState(null);
  const [participantIdToAdd, setParticipantIdToAdd] = useState('');

  // Modal States for Performance
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [evalForGoal, setEvalForGoal] = useState(null);
  const [newGoalText, setNewGoalText] = useState('');

  const [isAddFeedbackModalOpen, setIsAddFeedbackModalOpen] = useState(false);
  const [evalForFeedback, setEvalForFeedback] = useState(null);
  const [newFeedbackText, setNewFeedbackText] = useState('');

  // Modal States for Communication
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  // Modal States for Issues
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);
  const [newIssueType, setNewIssueType] = useState('Matériel');
  const [newIssueDesc, setNewIssueDesc] = useState('');

  // Modal States for Disciplinary
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  // Employee View States
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [visibleComments, setVisibleComments] = useState({});

  const [newCaseEmpId, setNewCaseEmpId] = useState('');
  const [newCaseType, setNewCaseType] = useState('Comportement');
  const [newCaseDesc, setNewCaseDesc] = useState('');

  const [isMediationModalOpen, setIsMediationModalOpen] = useState(false);
  const [caseForMediation, setCaseForMediation] = useState(null);
  const [mediationDate, setMediationDate] = useState('');

  const [isCaseNoteModalOpen, setIsCaseNoteModalOpen] = useState(false);
  const [caseForNote, setCaseForNote] = useState(null);
  const [caseNote, setCaseNote] = useState('');

  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);
  const [caseForSanction, setCaseForSanction] = useState(null);
  const [sanctionDesc, setSanctionDesc] = useState('');

  // Modal States for Benefits
  const [isNewBenefitModalOpen, setIsNewBenefitModalOpen] = useState(false);
  const [newBenefitName, setNewBenefitName] = useState('');

  // Modal States for Offboarding
  const [isOffboardingModalOpen, setIsOffboardingModalOpen] = useState(false);
  const [offboardingEmpId, setOffboardingEmpId] = useState('');

  // Modal States for Reports
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState(''); // 'absences' or 'payroll'

  const handleAnalyzeCV = (candidateId) => {
    // Simulate ATS analysis
    const score = Math.floor(Math.random() * 40) + 60; // Random score between 60 and 100
    setCandidates(prev => prev.map(c => 
      c.id === candidateId ? { ...c, atsScore: score } : c
    ));
    showNotification(`Analyse ATS terminée. Score: ${score}%`);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setEmployees([]);
    setAbsences([]);
    setLeaveRequests([]);
    setPayslipRequests([]);
    setMyPayslips([]);
    setNotifications({ leave: 0, payslip: 0 });
    localStorage.removeItem('user');
    setCurrentPage('dashboard');
  };

  const isHR = user && (user.username === 'admin' || user.username === 'rh');

  useEffect(() => {
    if (isHR) {
      fetch('http://localhost:5000/employees')
        .then(res => res.json())
        .then(data => {
          const mappedEmployees = (Array.isArray(data) ? data : []).map(emp => ({
            id: emp.id,
            username: emp.username,
            role: emp.post || 'N/A',
            department: emp.department || 'N/A',
            email: `${emp.username.toLowerCase().replace(/ /g, '.')}@benyaacoub.tn`,
            phone: "20 123 456",
            address: "Tunis",
            salary: emp.base_salary,
            daysoff: emp.daysoff,
            created_at: emp.created_at,
            contract_end_date: null,
            documents: []
          }));
          setEmployees(mappedEmployees);
        })
        .catch(err => console.error("Error fetching employees:", err));

      fetch('http://localhost:5000/all-absences')
        .then(res => res.json())
        .then(data => setAbsences(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error fetching absences:", err));

      fetch('http://localhost:5000/api/leave-requests')
        .then(res => res.json())
        .then(data => setLeaveRequests(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error fetching leave requests:", err));

      fetch('http://localhost:5000/api/payslip-requests')
        .then(res => res.json())
        .then(data => setPayslipRequests(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error fetching payslip requests:", err));
    } else if (user) {
      fetch(`http://localhost:5000/api/my-leave-requests/${user.id}`)
        .then(res => res.json())
        .then(data => setLeaveRequests(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error fetching my leave requests:", err));

      fetch(`http://localhost:5000/api/my-payslips/${user.id}`)
        .then(res => res.json())
        .then(data => setMyPayslips(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error fetching my payslips:", err));

      // Fetch notifications
      fetch(`http://localhost:5000/api/user-notifications/${user.id}`)
        .then(res => res.json())
        .then(data => setNotifications({ leave: data.leave_notifications, payslip: data.payslip_notifications }))
        .catch(err => console.error("Error fetching notifications:", err));
    }
  }, [isHR, user]);

  const markAsSeen = (type) => {
    if (!user) return;
    fetch(`http://localhost:5000/api/mark-seen/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    })
    .then(() => {
      setNotifications(prev => ({ ...prev, [type]: 0 }));
    })
    .catch(err => console.error("Error marking as seen:", err));
  };

  const handleUpdateLeaveStatus = (id, status, rejectionReason = null) => {
    fetch(`http://localhost:5000/api/leave-requests/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectionReason })
    })
    .then(res => {
      if (res.ok) {
        // Refresh list
        fetch('http://localhost:5000/api/leave-requests')
          .then(res => res.json())
          .then(data => setLeaveRequests(Array.isArray(data) ? data : []));
          
        // Also refresh employees to see updated balance
        fetch('http://localhost:5000/employees')
          .then(res => res.json())
          .then(data => {
            const mappedEmployees = (Array.isArray(data) ? data : []).map(emp => ({
              id: emp.id,
              username: emp.username,
              role: emp.post || 'N/A',
              department: emp.department || 'N/A',
              email: `${emp.username.toLowerCase().replace(/ /g, '.')}@benyaacoub.tn`,
              phone: "20 123 456",
              address: "Tunis",
              salary: emp.base_salary,
              daysoff: emp.daysoff,
              created_at: emp.created_at,
              contract_end_date: null,
              documents: []
            }));
            setEmployees(mappedEmployees);
          });
          
        // Show notification
        showNotification(status === 'approved' ? 'Demande approuvée' : 'Demande refusée');
      }
    })
    .catch(err => console.error("Error updating status:", err));
  };

  const handleUpdatePayslipStatus = (id, status) => {
    fetch(`http://localhost:5000/api/payslip-requests/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    .then(res => {
      if (res.ok) {
        fetch('http://localhost:5000/api/payslip-requests')
          .then(res => res.json())
          .then(data => setPayslipRequests(Array.isArray(data) ? data : []));
        showNotification(status === 'approved' ? 'Demande fiche de paie approuvée' : 'Demande fiche de paie refusée');
      }
    })
    .catch(err => console.error("Error updating payslip status:", err));
  };

  const handleUpdateAbsenceStatus = (id, status, rejectionReason = null) => {
    console.log(`Updating absence ${id} to ${status}`);
    fetch(`http://localhost:5000/api/absences/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectionReason })
    })
    .then(res => {
      if (res.ok) {
        fetch('http://localhost:5000/all-absences')
          .then(res => res.json())
          .then(data => setAbsences(Array.isArray(data) ? data : []));
        showNotification(status === 'approved' ? 'Absence validée' : 'Absence rejetée');
      } else {
        console.error("Failed to update absence status");
        res.text().then(text => console.error(text));
      }
    })
    .catch(err => console.error("Error updating absence status:", err));
  };

  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const generatePayslipPDF = (payslip) => {
    const doc = new jsPDF();
    let data = {};
    
    try {
        data = payslip.data ? JSON.parse(payslip.data) : null;
    } catch (e) {
        console.error("Error parsing payslip data", e);
    }

    if (!data) {
        // Fallback for old payslips
        doc.setFontSize(22);
        doc.text("Ben Yaacoub Company", 20, 20);
        doc.setFontSize(16);
        doc.text("Fiche de Paie (Simplifiée)", 20, 35);
        doc.setFontSize(12);
        doc.text(`Nom: ${user.username}`, 20, 50);
        doc.text(`Période: ${payslip.month} ${payslip.year}`, 20, 60);
        doc.text(`Salaire Brut: ${payslip.gross_salary} DT`, 20, 80);
        doc.text(`Salaire Net: ${payslip.net_salary} DT`, 20, 90);
        doc.save(`Fiche_Paie_${payslip.month}_${payslip.year}.pdf`);
        return;
    }

    // --- Full Payslip Layout ---
    
    // 1. Header (Employer Info)
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(data.employer.name, 20, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(data.employer.address, 20, 26);
    doc.text(`Matricule Fiscal: ${data.employer.matriculeFiscal}`, 20, 31);
    doc.text(`CNSS: ${data.employer.cnss}`, 20, 36);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("BULLETIN DE PAIE", 140, 25);
    doc.setFontSize(10);
    doc.text(`Période: ${data.period.month} ${data.period.year}`, 140, 32);

    // 2. Employee Info (Box)
    doc.setDrawColor(0);
    doc.rect(20, 45, 170, 35);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Salarié:", 25, 52);
    doc.setFont("helvetica", "normal");
    doc.text(`Nom & Prénom: ${data.employee.name}`, 25, 58);
    doc.text(`Matricule: ${data.employee.matricule}`, 25, 63);
    doc.text(`Adresse: ${data.employee.address}`, 25, 68);
    doc.text(`Poste: ${data.employee.post}`, 110, 58);
    doc.text(`Département: ${data.employee.dept}`, 110, 63);
    doc.text(`Date d'embauche: ${data.employee.hireDate}`, 110, 68);
    doc.text(`Contrat: ${data.employee.contract}`, 110, 73);

    // 3. General Month Info
    doc.setFontSize(10);
    doc.text(`Jours travaillés: ${data.period.daysWorked}`, 20, 90);
    doc.text(`Heures travaillées: ${data.period.hoursWorked}`, 70, 90);
    doc.text(`Absences: ${data.period.absences}`, 120, 90);
    doc.text(`Congés pris: 0`, 160, 90);

    // 4. Salary Details Table Header
    let y = 100;
    doc.setFillColor(230, 230, 230);
    doc.rect(20, y, 170, 8, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("Rubriques", 25, y + 5);
    doc.text("Base", 100, y + 5);
    doc.text("Taux", 120, y + 5);
    doc.text("Gains (+)", 140, y + 5);
    doc.text("Retenues (-)", 165, y + 5);
    y += 10;

    // Rows
    doc.setFont("helvetica", "normal");
    
    const addRow = (label, base, rate, gain, deduction) => {
        doc.text(label, 25, y);
        if(base) doc.text(base.toString(), 100, y);
        if(rate) doc.text(rate.toString(), 120, y);
        if(gain) doc.text(gain.toString(), 140, y);
        if(deduction) doc.text(deduction.toString(), 165, y);
        y += 6;
    };

    addRow("Salaire de Base", data.salary.base, "", data.salary.base, "");
    if (parseFloat(data.salary.primes) > 0) addRow("Primes", "", "", data.salary.primes, "");
    
    addRow("CNSS", data.salary.gross, "9.18%", "", data.deductions.cnss);
    addRow("IRPP (Impôt)", data.summary.taxable, "Var", "", data.deductions.irpp);
    addRow("CSS (Solidarité)", data.summary.taxable, "1%", "", data.deductions.css);
    
    if (parseFloat(data.deductions.sanction) > 0) {
        addRow("Sanction (Absences)", "", "", "", data.deductions.sanction);
    }

    // 5. Totals
    y += 5;
    doc.line(20, y, 190, y);
    y += 10;
    
    doc.setFont("helvetica", "bold");
    doc.text("Salaire Brut:", 25, y);
    doc.text(data.salary.gross + " DT", 60, y);
    
    doc.text("Total Retenues:", 100, y);
    doc.text((parseFloat(data.deductions.cnss) + parseFloat(data.deductions.irpp) + parseFloat(data.deductions.css) + parseFloat(data.deductions.sanction)).toFixed(2) + " DT", 140, y);
    
    y += 10;
    doc.setFillColor(220, 240, 255);
    doc.rect(100, y - 6, 90, 12, 'F');
    doc.setFontSize(12);
    doc.text("NET À PAYER:", 105, y + 2);
    doc.text(data.summary.netToPay + " DT", 150, y + 2);

    // 6. Footer / Bank Info
    y += 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Mode de paiement: Virement Bancaire", 20, y);
    doc.text(`Banque: ${data.bank.name}`, 20, y + 5);
    doc.text(`RIB: ${data.bank.rib}`, 20, y + 10);

    y += 20;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("Pour faire valoir ce que de droit.", 20, y);
    doc.text("Document généré électroniquement.", 20, y + 4);

    doc.save(`Fiche_Paie_${data.period.month}_${data.period.year}.pdf`);
  };

  const handleClockIn = () => {
    const today = new Date().toISOString().split("T")[0];
    const userId = user?.id || 1;
    
    // Check if already clocked in
    const existingClockIn = clockIns.find(c => c.employeeId === userId && c.date === today);
    
    if (existingClockIn) {
      alert("Vous avez déjà pointé pour aujourd'hui.");
      return;
    }

    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    const newClockIn = {
      id: clockIns.length + 1,
      employeeId: userId,
      date: today,
      in: timeString,
      out: null,
      status: "En cours"
    };

    setClockIns([...clockIns, newClockIn]);
    alert("Entrée enregistrée à " + timeString);
  };
  
  const handleClockOut = () => {
    const today = new Date().toISOString().split("T")[0];
    const userId = user?.id || 1;
    
    // Find today's clock-in
    const clockInIndex = clockIns.findIndex(c => c.employeeId === userId && c.date === today && c.out === null);
    
    if (clockInIndex !== -1) {
      const newClockIns = [...clockIns];
      const now = new Date();
      const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      newClockIns[clockInIndex] = { ...newClockIns[clockInIndex], out: timeString, status: 'Présent' };
      setClockIns(newClockIns);
      alert("Sortie enregistrée à " + timeString);
    } else {
      alert("Aucun pointage d'entrée trouvé pour aujourd'hui ou vous êtes déjà sorti.");
    }
  };

  const handleLikePost = (postId) => {
    const newPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setPosts(newPosts);
  };

  const toggleComments = (postId) => {
    setVisibleComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const renderContent = () => {
    const today = new Date().toISOString().split("T")[0];
    const userId = user?.id || 1;
    const todayClockIn = clockIns.find(c => c.employeeId === userId && c.date === today);

    switch (currentPage) {
      case 'dashboard':
        return isHR ? (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Total Employés</h3>
                <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{employees.length}</div>
                <div className="text-xs text-green-500 font-medium">Actifs</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Demandes</h3>
                <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{leaveRequests.filter(r => r.status === 'pending').length}</div>
                <div className="text-xs text-orange-500 font-medium">En attente de validation</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Absences</h3>
                <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{absences.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}</div>
                <div className="text-xs text-red-500 font-medium">Aujourd'hui</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Dernières Absences Signalées</h3>
              <div className="space-y-4">
                {absences.length > 0 ? absences.slice(0, 5).map((absence, index) => (
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600" key={index}>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(absence.date).toLocaleDateString()}</span>
                    <span className="flex-1 ml-4 text-gray-700 dark:text-gray-200">
                        <strong>{absence.username}</strong> : {absence.reason}
                        <br/>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            absence.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                            absence.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                            Statut: {absence.status === 'approved' ? 'Validé' : absence.status === 'rejected' ? 'Refusé' : 'En attente'}
                        </span>
                    </span>
                  </div>
                )) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Aucune absence récente.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Congés Annuels</h3>
                <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">25 <span className="text-sm font-normal text-gray-500">Jours</span></div>
                <div className="text-xs text-indigo-500 font-medium">Droit total</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Restant</h3>
                <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{user.daysoff !== undefined ? user.daysoff : 12} <span className="text-sm font-normal text-gray-500">Jours</span></div>
                <div className="text-xs text-green-500 font-medium">Disponibles</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Prochaine Paie</h3>
                <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">25 Déc</div>
                <div className="text-xs text-purple-500 font-medium">Dans 24 jours</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Activité Récente</h3>
                <div className="space-y-4">
                  {/* Always show login */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-500">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Connexion au portail</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">À l'instant</p>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Leave Requests */}
                  {leaveRequests.slice(0, 3).map((req, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 ${
                      req.status === 'approved' ? 'border-green-500' : req.status === 'rejected' ? 'border-red-500' : 'border-yellow-500'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          req.status === 'approved' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 
                          req.status === 'rejected' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' : 
                          'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Demande de congé {req.status === 'approved' ? 'validée' : req.status === 'rejected' ? 'refusée' : 'envoyée'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Dynamic Payslips */}
                  {myPayslips.slice(0, 2).map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-purple-500">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Fiche de paie disponible</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{p.month} {p.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
               <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Annonces Entreprise</h3>
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-4 text-white shadow-md">
                    <h4 className="font-bold text-lg mb-1">Fête de fin d'année</h4>
                    <p className="text-purple-100 text-sm">N'oubliez pas de répondre pour la fête annuelle !</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto animate-fade-in">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                {user.username.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{user.username}</h3>
                <p className="text-gray-500 dark:text-gray-400">Développeur Fullstack</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">ID Employé</p>
                <p className="font-semibold text-gray-800 dark:text-white">{user.id}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Département</p>
                <p className="font-semibold text-gray-800 dark:text-white">IT / Engineering</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <p className="font-semibold text-gray-800 dark:text-white">{user.username}@entreprise.com</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date d'embauche</p>
                <p className="font-semibold text-gray-800 dark:text-white">12 Janvier 2023</p>
              </div>
            </div>
          </div>
        );

      case 'leave_requests':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Mes Demandes de Congés</h3>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 transition-colors shadow-sm flex items-center gap-2" onClick={() => setIsChatOpen(true)}>
                <span>+ Nouvelle Demande</span>
              </button>
            </div>
            
            {leaveRequests.length > 0 ? (
              <div className="space-y-4">
                {leaveRequests.map(req => (
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow" key={req.id}>
                    <div className="flex items-center gap-4 mb-2 md:mb-0">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">Congé {req.reason ? `- ${req.reason}` : ''}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Du {new Date(req.start_date).toLocaleDateString()} au {new Date(req.end_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      req.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                      req.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {req.status === 'approved' ? 'Validé' : req.status === 'rejected' ? 'Refusé' : 'En attente'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400">Vous n'avez aucune demande en cours.</p>
                <button className="mt-4 text-indigo-600 hover:underline" onClick={() => setIsChatOpen(true)}>Faire une demande via le chat</button>
              </div>
            )}
          </div>
        );

      case 'payslips':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Mes Fiches de Paie</h3>
            {myPayslips.length > 0 ? (
              <div className="space-y-4">
                {myPayslips.map(p => (
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" key={p.id}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">{p.month} {p.year}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Salaire Brut: {p.gross_salary} DT</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-2" onClick={() => generatePayslipPDF(p)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      Télécharger
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
                <p className="text-gray-500 dark:text-gray-400">Aucune fiche de paie disponible.</p>
              </div>
            )}
          </div>
        );

      case 'team':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Mon Équipe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  JD
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">Jean Dupont</h4>
                  <p className="text-sm text-indigo-600 dark:text-white font-medium">Manager</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">jean.dupont@company.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  AL
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">Alice Leroy</h4>
                  <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">Designer</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">alice.leroy@company.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 opacity-75">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  +
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">Recrutement en cours</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Développeur Frontend</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'recruitment':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recrutement</h3>
              <button 
                onClick={() => {
                  setNewJobTitle('');
                  setIsNewJobModalOpen(true);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 transition-colors shadow-sm flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                <span>Nouvelle Offre</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg border border-indigo-100 dark:border-gray-600">
                <h4 className="text-sm font-medium text-indigo-600 dark:text-indigo-300 uppercase">Postes Ouverts</h4>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{jobOffers.length}</p>
              </div>
              <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
                <h4 className="text-sm font-medium text-purple-600 dark:text-purple-300 uppercase">Candidatures</h4>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{candidates.length}</p>
              </div>
              <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg border border-green-100 dark:border-gray-600">
                <h4 className="text-sm font-medium text-green-600 dark:text-green-300 uppercase">Entretiens</h4>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{candidates.filter(c => c.status === 'Entretien').length}</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Gestion des Offres</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">
                      <th className="p-3 font-semibold border-b dark:border-gray-600">Titre</th>
                      <th className="p-3 font-semibold border-b dark:border-gray-600">Département</th>
                      <th className="p-3 font-semibold border-b dark:border-gray-600">Type</th>
                      <th className="p-3 font-semibold border-b dark:border-gray-600">Candidats</th>
                      <th className="p-3 font-semibold border-b dark:border-gray-600">Statut</th>
                      <th className="p-3 font-semibold border-b dark:border-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-200">
                    {jobOffers.map(job => (
                      <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700">
                        <td className="p-3 font-medium">{job.title}</td>
                        <td className="p-3">{job.dept}</td>
                        <td className="p-3"><span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs">{job.type}</span></td>
                        <td className="p-3">{job.candidates}</td>
                        <td className="p-3">
                           <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-bold rounded-full">{job.status}</span>
                        </td>
                        <td className="p-3">
                          <button 
                            onClick={() => {
                              setEditingJob(job);
                              setEditJobTitle(job.title);
                              setIsEditJobModalOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-300 text-sm font-medium"
                          >
                            Éditer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Candidatures & ATS</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 font-medium">Candidat</th>
                      <th className="py-3 font-medium">Poste</th>
                      <th className="py-3 font-medium">CV</th>
                      <th className="py-3 font-medium">Score ATS</th>
                      <th className="py-3 font-medium">Statut</th>
                      <th className="py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-200">
                    {candidates.filter(c => c.status !== 'Recruté').map((c) => (
                      <tr key={c.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="py-3 font-medium">{c.name}</td>
                        <td className="py-3">{c.role}</td>
                        <td className="py-3">
                            <button onClick={() => {
                              setCvCandidate(c);
                              setIsCVModalOpen(true);
                            }} className="flex items-center gap-1 text-indigo-600 hover:underline text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                {c.cv}
                            </button>
                        </td>
                        <td className="py-3">
                            {c.atsScore ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 w-24">
                                        <div className={`h-2.5 rounded-full ${c.atsScore >= 80 ? 'bg-green-600' : c.atsScore >= 50 ? 'bg-yellow-400' : 'bg-red-600'}`} style={{ width: `${c.atsScore}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold">{c.atsScore}%</span>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handleAnalyzeCV(c.id)}
                                    className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-xs font-bold rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                                >
                                    Analyser ATS
                                </button>
                            )}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            c.status === 'Nouveau' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                            c.status === 'Entretien' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>{c.status}</span>
                        </td>
                        <td className="py-3">
                          <button 
                            onClick={() => setSelectedCandidate(c)}
                            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {candidates.some(c => c.status === 'Recruté') && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Suivi d'Intégration (Onboarding)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {candidates.filter(c => c.status === 'Recruté').map(c => (
                    <div key={c.id} className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-green-200 dark:border-green-900 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center font-bold">
                            {c.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="font-bold text-gray-800 dark:text-white">{c.name}</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{c.role}</p>
                          </div>
                        </div>
                        <button className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100 hover:bg-indigo-100" onClick={() => {
                          setContractCandidate(c);
                          setIsContractModalOpen(true);
                        }}>
                          Voir Contrat
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-600 rounded">
                          <span className="text-sm text-gray-700 dark:text-gray-200">Signature Contrat</span>
                          <input type="checkbox" checked={c.onboarding?.contract} onChange={() => {
                             setCandidates(candidates.map(cand => cand.id === c.id ? { ...cand, onboarding: { ...cand.onboarding, contract: !cand.onboarding.contract } } : cand));
                          }} className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-600 rounded">
                          <span className="text-sm text-gray-700 dark:text-gray-200">Préparation Matériel</span>
                          <input type="checkbox" checked={c.onboarding?.equipment} onChange={() => {
                             setCandidates(candidates.map(cand => cand.id === c.id ? { ...cand, onboarding: { ...cand.onboarding, equipment: !cand.onboarding.equipment } } : cand));
                          }} className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-600 rounded">
                          <span className="text-sm text-gray-700 dark:text-gray-200">Création Compte</span>
                          <input type="checkbox" checked={c.onboarding?.account} onChange={() => {
                             setCandidates(candidates.map(cand => cand.id === c.id ? { ...cand, onboarding: { ...cand.onboarding, account: !cand.onboarding.account } } : cand));
                          }} className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-600 rounded">
                          <span className="text-sm text-gray-700 dark:text-gray-200">Formation Initiale</span>
                          <input type="checkbox" checked={c.onboarding?.training} onChange={() => {
                             setCandidates(candidates.map(cand => cand.id === c.id ? { ...cand, onboarding: { ...cand.onboarding, training: !cand.onboarding.training } } : cand));
                          }} className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-800">
                          <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${
                            Object.values(c.onboarding || {}).filter(Boolean).length * 25
                          }%` }}></div>
                        </div>
                        <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                          {Object.values(c.onboarding || {}).filter(Boolean).length * 25}% Complété
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedCandidate && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all scale-100">
                  {/* Header with gradient */}
                  <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-indigo-600">
                    <button 
                      onClick={() => setSelectedCandidate(null)}
                      className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 bg-white dark:bg-gray-800 p-1 rounded-full shadow-lg">
                            <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-3xl font-bold">
                                {selectedCandidate.name.substring(0, 2).toUpperCase()}
                            </div>
                        </div>
                    </div>
                  </div>
                  
                  <div className="pt-16 px-8 pb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedCandidate.name}</h3>
                            <p className="text-indigo-600 dark:text-white font-medium text-lg">{selectedCandidate.role}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            selectedCandidate.status === 'Nouveau' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' :
                            selectedCandidate.status === 'Entretien' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                            {selectedCandidate.status}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Date de candidature</p>
                            <p className="font-medium text-gray-800 dark:text-white">{new Date(selectedCandidate.date).toLocaleDateString()}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">CV</p>
                            <button onClick={() => {
                                setDownloadDocName(selectedCandidate.cv);
                                setIsDownloadModalOpen(true);
                            }} className="text-indigo-600 hover:underline font-medium flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                {selectedCandidate.cv}
                            </button>
                        </div>
                    </div>

                    {selectedCandidate.atsScore && (
                       <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                          <div className="flex justify-between mb-2 items-center">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Compatibilité ATS</span>
                            <span className={`text-lg font-bold ${selectedCandidate.atsScore >= 80 ? 'text-green-600' : selectedCandidate.atsScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{selectedCandidate.atsScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 overflow-hidden">
                              <div className={`h-2.5 rounded-full transition-all duration-1000 ${selectedCandidate.atsScore >= 80 ? 'bg-green-500' : selectedCandidate.atsScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${selectedCandidate.atsScore}%` }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Basé sur l'analyse des mots-clés et compétences.</p>
                       </div>
                    )}
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <button 
                            onClick={() => {
                                window.location.href = `mailto:${selectedCandidate.name.toLowerCase().replace(' ', '.')}@email.com`;
                                showNotification("Client de messagerie ouvert");
                            }}
                            className="flex-1 py-3 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            Contacter
                        </button>
                        <button 
                            onClick={() => {
                                setInterviewDate(new Date().toLocaleString());
                                setIsInterviewModalOpen(true);
                            }}
                            className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Planifier Entretien
                        </button>
                      </div>
                      {selectedCandidate.status === 'Entretien' && (
                        <button 
                            onClick={() => setIsRecruitModalOpen(true)}
                            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Valider le Recrutement
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* New Job Modal */}
            {isNewJobModalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nouvelle Offre</h3>
                  <input 
                    type="text" 
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="Titre du poste"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setIsNewJobModalOpen(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={() => {
                        if (newJobTitle) {
                          const newJob = { 
                            id: jobOffers.length + 1, 
                            title: newJobTitle, 
                            dept: "Engineering", 
                            type: "CDI", 
                            candidates: 0, 
                            status: "Active", 
                            location: "Paris" 
                          };
                          setJobOffers([...jobOffers, newJob]);
                          showNotification("Nouvelle offre créée !");
                          setIsNewJobModalOpen(false);
                          setNewJobTitle('');
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Créer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Job Modal */}
            {isEditJobModalOpen && editingJob && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Éditer l'offre</h3>
                  <input 
                    type="text" 
                    value={editJobTitle}
                    onChange={(e) => setEditJobTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setIsEditJobModalOpen(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={() => {
                        if (editJobTitle) {
                          setJobOffers(jobOffers.map(j => j.id === editingJob.id ? { ...j, title: editJobTitle } : j));
                          showNotification("Offre mise à jour");
                          setIsEditJobModalOpen(false);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CV Modal */}
            {isCVModalOpen && cvCandidate && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Télécharger le CV</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Voulez-vous télécharger le CV de <strong>{cvCandidate.name}</strong> ?</p>
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => setIsCVModalOpen(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={() => {
                        setDownloadDocName(cvCandidate.name + " CV");
                        setIsDownloadModalOpen(true);
                        setIsCVModalOpen(false);
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contract Modal */}
            {isContractModalOpen && contractCandidate && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Contrat de Travail</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Le contrat pour <strong>{contractCandidate.name}</strong> a été généré avec succès.</p>
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => setIsContractModalOpen(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Fermer
                    </button>
                    <button 
                      onClick={() => {
                        setDownloadDocName("Contrat - " + contractCandidate.name);
                        setIsDownloadModalOpen(true);
                        setIsContractModalOpen(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Ouvrir le PDF
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Interview Modal */}
            {isInterviewModalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Planifier un Entretien</h3>
                  <input 
                    type="text" 
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    placeholder="Date et Heure (JJ/MM/AAAA HH:MM)"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setIsInterviewModalOpen(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={() => {
                        if (interviewDate) {
                          setCandidates(candidates.map(c => c.id === selectedCandidate.id ? { ...c, status: 'Entretien' } : c));
                          setSelectedCandidate({ ...selectedCandidate, status: 'Entretien' });
                          showNotification(`Entretien planifié le ${interviewDate}`);
                          setIsInterviewModalOpen(false);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recruit Modal */}
            {isRecruitModalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Confirmer le Recrutement</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">Êtes-vous sûr de vouloir recruter <strong>{selectedCandidate?.name}</strong> ?</p>
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => setIsRecruitModalOpen(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={() => {
                        setCandidates(candidates.map(c => c.id === selectedCandidate.id ? { ...c, status: 'Recruté' } : c));
                        setSelectedCandidate(null);
                        showNotification("Candidat recruté ! Passage à l'onboarding.");
                        setIsRecruitModalOpen(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'payroll':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Gestion de la Paie - Décembre 2025</h3>
                <button onClick={() => showNotification("Paie du mois validée et transmise à la comptabilité")} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Valider & Transmettre
                </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold border-b dark:border-gray-600">Employé</th>
                    <th className="p-4 font-semibold border-b dark:border-gray-600">Salaire Base (Mois)</th>
                    <th className="p-4 font-semibold border-b dark:border-gray-600">Heures Trav.</th>
                    <th className="p-4 font-semibold border-b dark:border-gray-600">H. Sup</th>
                    <th className="p-4 font-semibold border-b dark:border-gray-600">Primes</th>
                    <th className="p-4 font-semibold border-b dark:border-gray-600">Total Brut</th>
                    <th className="p-4 font-semibold border-b dark:border-gray-600">Statut</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-200">
                  {payrollData.map((p) => {
                    const emp = employees.find(e => e.id === p.employeeId) || { username: 'Inconnu', role: 'N/A' };
                    const monthlyBase = p.baseSalary / 12;
                    const hourlyRate = monthlyBase / 151.67;
                    const overtimePay = p.overtime * (hourlyRate * 1.25); // +25% for overtime
                    const total = monthlyBase + overtimePay + p.bonuses;
                    
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700 last:border-0">
                        <td className="p-4">
                            <div className="font-bold">{emp.username}</div>
                            <div className="text-xs text-gray-500">{emp.role}</div>
                        </td>
                        <td className="p-4 font-medium">{monthlyBase.toFixed(2)} DT</td>
                        <td className="p-4">
                            <input 
                                type="number" 
                                value={p.hoursWorked} 
                                onChange={(e) => setPayrollData(payrollData.map(item => item.id === p.id ? { ...item, hoursWorked: parseFloat(e.target.value) } : item))}
                                className="w-20 p-1 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded text-center"
                            />
                        </td>
                        <td className="p-4">
                            <input 
                                type="number" 
                                value={p.overtime} 
                                onChange={(e) => setPayrollData(payrollData.map(item => item.id === p.id ? { ...item, overtime: parseFloat(e.target.value) } : item))}
                                className="w-20 p-1 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded text-center"
                            />
                        </td>
                        <td className="p-4">
                            <input 
                                type="number" 
                                value={p.bonuses} 
                                onChange={(e) => setPayrollData(payrollData.map(item => item.id === p.id ? { ...item, bonuses: parseFloat(e.target.value) } : item))}
                                className="w-20 p-1 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded text-center"
                            />
                        </td>
                        <td className="p-4 font-bold text-indigo-600 dark:text-white">
                            {total.toFixed(2)} DT
                        </td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'Validated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {p.status === 'Validated' ? 'Validé' : 'En attente'}
                            </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'employees':
        const departments = ['All', ...new Set(employees.map(e => e.department).filter(Boolean))];
        const filteredEmployees = selectedDept === 'All' ? employees : employees.filter(e => e.department === selectedDept);

        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Gestion des Employés</h3>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Département:</label>
                    <select 
                        value={selectedDept} 
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="p-1 bg-transparent text-gray-800 dark:text-white font-semibold outline-none cursor-pointer"
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept} className="text-gray-800">{dept}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold border-b dark:border-gray-600">ID</th>
                    <th className="p-4 font-semibold border-b dark:border-gray-600">Nom</th>
                    <th className="p-4 font-semibold border-b dark:border-gray-600">Département</th>
                    <th className="p-4 font-semibold border-b dark:border-gray-600">Solde Congés</th>
                    <th className="p-4 font-semibold border-b dark:border-gray-600">Contrat</th>
                    <th className="p-4 font-semibold border-b dark:border-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-200">
                  {filteredEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b dark:border-gray-700 last:border-0">
                      <td className="p-4 font-medium">#{emp.id}</td>
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-bold">
                          {emp.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-bold">{emp.username}</div>
                            <div className="text-xs text-gray-500">{emp.role}</div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{emp.department || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${emp.daysoff > 5 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                          {emp.daysoff} jours
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        {emp.contract_end_date ? (
                            <span className={`px-2 py-1 rounded text-xs font-bold ${new Date(emp.contract_end_date) < new Date(new Date().setMonth(new Date().getMonth() + 3)) ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                                {new Date(emp.contract_end_date).toLocaleDateString()}
                            </span>
                        ) : <span className="text-gray-400">CDI</span>}
                      </td>
                      <td className="p-4">
                        <button 
                            onClick={() => setSelectedEmployee(emp)}
                            className="text-indigo-600 hover:text-indigo-800 dark:text-white dark:hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedEmployee && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                    {selectedEmployee.username.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedEmployee.username}</h3>
                                    <p className="text-indigo-600 dark:text-white font-medium">{selectedEmployee.role}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">ID: #{selectedEmployee.id} • Embauché le {new Date(selectedEmployee.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedEmployee(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="flex border-b border-gray-100 dark:border-gray-700">
                            <button 
                                onClick={() => setActiveTab('info')}
                                className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'info' ? 'text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                Informations
                                {activeTab === 'info' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"></div>}
                            </button>
                            <button 
                                onClick={() => setActiveTab('docs')}
                                className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'docs' ? 'text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                Documents
                                {activeTab === 'docs' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"></div>}
                            </button>
                            <button 
                                onClick={() => setActiveTab('leaves')}
                                className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${activeTab === 'leaves' ? 'text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                Congés & Absences
                                {activeTab === 'leaves' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"></div>}
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {activeTab === 'info' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Email Professionnel</label>
                                            <input type="text" value={selectedEmployee.email} readOnly className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Téléphone</label>
                                            <input type="text" defaultValue={selectedEmployee.phone} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Adresse Postale</label>
                                            <input type="text" defaultValue={selectedEmployee.address} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Poste Actuel</label>
                                            <input type="text" defaultValue={selectedEmployee.role} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Département</label>
                                            <input type="text" defaultValue={selectedEmployee.department} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Salaire Brut Annuel</label>
                                            <div className="relative">
                                                <input type="text" defaultValue={selectedEmployee.salary} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none pl-8" />
                                                <span className="absolute left-3 top-2 text-gray-500">DT</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Fin de Contrat</label>
                                            <input type="date" defaultValue={selectedEmployee.contract_end_date} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <button onClick={() => {
                                            setEditingEmployee(selectedEmployee);
                                            setEditEmployeeRole(selectedEmployee.role);
                                            setEditEmployeeDept(selectedEmployee.department);
                                            setIsEditEmployeeModalOpen(true);
                                        }} className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg font-semibold transition-colors border border-purple-200">
                                            Gérer Mutation / Promotion
                                        </button>
                                        <button onClick={() => showNotification("Informations mises à jour avec succès")} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 rounded-lg font-semibold transition-colors">
                                            Enregistrer les modifications
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'docs' && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-gray-800 dark:text-white">Documents Actifs</h4>
                                            <button onClick={() => {
                                                setDocEmployee(selectedEmployee);
                                                setNewDocName('');
                                                setNewDocType('Autre');
                                                setIsAddDocModalOpen(true);
                                            }} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-100 border border-indigo-200 transition-colors">
                                                + Ajouter un document
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {(selectedEmployee.documents || []).filter(d => !d.archived).map((doc, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 group hover:border-indigo-300 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded ${doc.type === 'Contrat' ? 'bg-indigo-100 text-indigo-600' : doc.type === 'CIN' ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-600'}`}>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-700 dark:text-gray-200">{doc.name}</p>
                                                            <p className="text-xs text-gray-500">{doc.type}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => {
                                                            setDownloadDocName(doc.name);
                                                            setIsDownloadModalOpen(true);
                                                        }} className="p-1 text-gray-500 hover:text-indigo-600" title="Télécharger">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                                        </button>
                                                        <button onClick={() => {
                                                            if(window.confirm("Archiver ce document ?")) {
                                                                const updatedDocs = selectedEmployee.documents.map(d => d === doc ? {...d, archived: true} : d);
                                                                const updatedEmp = {...selectedEmployee, documents: updatedDocs};
                                                                setEmployees(employees.map(e => e.id === selectedEmployee.id ? updatedEmp : e));
                                                                setSelectedEmployee(updatedEmp);
                                                                showNotification("Document archivé");
                                                            }
                                                        }} className="p-1 text-gray-500 hover:text-orange-600" title="Archiver">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!selectedEmployee.documents || selectedEmployee.documents.filter(d => !d.archived).length === 0) && (
                                                <p className="text-center text-gray-500 italic py-4">Aucun document actif.</p>
                                            )}
                                        </div>
                                    </div>

                                    {(selectedEmployee.documents || []).some(d => d.archived) && (
                                        <div>
                                            <h4 className="font-bold text-gray-600 dark:text-gray-400 mb-4 text-sm uppercase">Archives</h4>
                                            <div className="grid grid-cols-1 gap-3 opacity-75">
                                                {(selectedEmployee.documents || []).filter(d => d.archived).map((doc, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 text-gray-400">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-600 dark:text-gray-400 line-through">{doc.name}</p>
                                                                <p className="text-xs text-gray-400">{doc.type} - Archivé</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => {
                                                            const updatedDocs = selectedEmployee.documents.map(d => d === doc ? {...d, archived: false} : d);
                                                            const updatedEmp = {...selectedEmployee, documents: updatedDocs};
                                                            setEmployees(employees.map(e => e.id === selectedEmployee.id ? updatedEmp : e));
                                                            setSelectedEmployee(updatedEmp);
                                                            showNotification("Document restauré");
                                                        }} className="text-xs text-indigo-500 hover:underline">Restaurer</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'leaves' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-gray-800 dark:text-white">Historique des Congés</h4>
                                        <span className="text-sm font-medium text-gray-500">Solde: <span className="text-green-600 font-bold">{selectedEmployee.daysoff} jours</span></span>
                                    </div>
                                    <div className="space-y-3">
                                        {/* Mock data for leaves history if leaveRequests is empty or doesn't match */}
                                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-white text-sm">Congés Payés</p>
                                                <p className="text-xs text-gray-500">12/08/2023 - 25/08/2023</p>
                                            </div>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold">Validé</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-white text-sm">RTT</p>
                                                <p className="text-xs text-gray-500">05/05/2023</p>
                                            </div>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold">Validé</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
          </div>
        );

      case 'validations':
        const pendingRequests = leaveRequests.filter(r => r.status === 'pending');
        const pendingPayslips = payslipRequests.filter(r => r.status === 'pending');
        const pendingAbsences = absences.filter(r => r.status === 'pending');
        
        return (
          <div className="space-y-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Centre de Validation</h3>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                  Demandes de Congés
                </h4>
                <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 text-xs font-bold px-2 py-1 rounded-full">{pendingRequests.length} en attente</span>
              </div>
              
              {pendingRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingRequests.map(req => (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow" key={`leave-${req.id}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-full flex items-center justify-center font-bold text-xs">
                            {req.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 dark:text-white text-sm">{req.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(req.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          <span className="font-semibold">Période:</span> {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">Raison:</span> {req.reason}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <button className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded transition-colors" onClick={() => handleUpdateLeaveStatus(req.id, 'approved')}>Accepter</button>
                        <button className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors" onClick={() => {
                          setRejectRequestId(req.id);
                          setRejectRequestType('leave');
                          setRejectReason('');
                          setIsRejectModalOpen(true);
                        }}>Refuser</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">Aucune demande de congé à valider.</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                  Signalements d'Absences
                </h4>
                <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-bold px-2 py-1 rounded-full">{pendingAbsences.length} en attente</span>
              </div>

              {pendingAbsences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingAbsences.map(absence => (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow" key={`absence-${absence.id}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-full flex items-center justify-center font-bold text-xs">
                            {absence.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 dark:text-white text-sm">{absence.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(absence.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">Raison:</span> {absence.reason}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <button className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded transition-colors" onClick={() => handleUpdateAbsenceStatus(absence.id, 'approved')}>Valider</button>
                        <button className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors" onClick={() => {
                          setRejectRequestId(absence.id);
                          setRejectRequestType('absence');
                          setRejectReason('');
                          setIsRejectModalOpen(true);
                        }}>Refuser</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">Aucun signalement d'absence à valider.</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                  Demandes de Fiches de Paie
                </h4>
                <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs font-bold px-2 py-1 rounded-full">{pendingPayslips.length} en attente</span>
              </div>

              {pendingPayslips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingPayslips.map(req => (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow" key={`payslip-${req.id}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200 rounded-full flex items-center justify-center font-bold text-xs">
                            {req.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 dark:text-white text-sm">{req.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(req.request_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Demande sa dernière fiche de paie.
                        </p>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <button className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded transition-colors" onClick={() => handleUpdatePayslipStatus(req.id, 'approved')}>Envoyer</button>
                        <button className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors" onClick={() => handleUpdatePayslipStatus(req.id, 'rejected')}>Refuser</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">Aucune demande de fiche de paie à valider.</p>
              )}
            </div>
          </div>
        );

      case 'training':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Formation & Développement</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Développement des compétences et certifications</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => {
                            setNewTrainingNeed('');
                            setIsTrainingNeedModalOpen(true);
                        }}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
                    >
                        + Détecter un besoin
                    </button>
                    <button 
                        onClick={() => {
                            setNewTrainingTitle('');
                            setIsNewTrainingModalOpen(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Nouvelle Formation
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Plan Annuel 2025</h4>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-3xl font-bold text-indigo-600 dark:text-white">65%</span>
                        <span className="text-sm text-indigo-600 dark:text-white mb-1">Réalisé</span>
                    </div>
                    <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                    <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2">E-Learning</h4>
                    <div className="flex items-center gap-3">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">142</div>
                        <div className="text-sm text-purple-600 dark:text-purple-400 leading-tight">Heures de formation<br/>suivies ce mois</div>
                    </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                    <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">Certifications</h4>
                    <div className="flex items-center gap-3">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">8</div>
                        <div className="text-sm text-green-600 dark:text-green-400 leading-tight">Collaborateurs<br/>certifiés (Q4)</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Training List (Plan Annuel) */}
                <div className="lg:col-span-2 space-y-6">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Plan de Formation en cours
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                        {trainings.map(training => (
                            <div key={training.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h5 className="font-bold text-gray-800 dark:text-white text-lg">{training.title}</h5>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-xs font-semibold px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full">{training.type}</span>
                                            <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full">Compétence Clé</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        training.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                                        training.status === 'En cours' ? 'bg-indigo-100 text-indigo-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {training.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {training.duration}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {new Date(training.date).toLocaleDateString()}
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Participants ({training.participants.length})</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {training.participants.map(pId => {
                                                const emp = employees.find(e => e.id === pId);
                                                return emp ? (
                                                    <div key={pId} className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-700" title={emp.username}>
                                                        {emp.username.substring(0, 2).toUpperCase()}
                                                    </div>
                                                ) : null;
                                            })}
                                            <button 
                                                onClick={() => {
                                                    setTrainingToAddTo(training);
                                                    setParticipantIdToAdd('');
                                                    setIsAddParticipantModalOpen(true);
                                                }}
                                                className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-700 hover:bg-gray-300 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        {training.status === 'Terminé' && (
                                            <button onClick={() => showNotification("Génération des certificats pour " + training.title)} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                Certificats
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Skills & E-Learning */}
                <div className="space-y-6">
                    {/* Skills Matrix Preview */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 text-sm uppercase">Suivi des Compétences</h4>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-600 dark:text-gray-300">React / Node.js</span>
                                    <span className="font-bold text-indigo-600">85%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{width: '85%'}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-600 dark:text-gray-300">Gestion de Projet</span>
                                    <span className="font-bold text-green-600">60%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <div className="bg-green-600 h-1.5 rounded-full" style={{width: '60%'}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-600 dark:text-gray-300">Soft Skills</span>
                                    <span className="font-bold text-purple-600">75%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <div className="bg-purple-600 h-1.5 rounded-full" style={{width: '75%'}}></div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 text-xs text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                            Voir la matrice complète
                        </button>
                    </div>

                    {/* E-Learning Platform */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800">
                        <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-4 text-sm uppercase flex items-center gap-2">
                            <span>🎓</span> Plateforme E-Learning
                        </h4>
                        <div className="space-y-3">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900 flex gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded flex items-center justify-center text-lg">🔒</div>
                                <div>
                                    <h5 className="font-bold text-xs text-gray-800 dark:text-white">Cybersécurité Avancée</h5>
                                    <p className="text-xs text-gray-500">2h 30m • En cours</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900 flex gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-lg">🌱</div>
                                <div>
                                    <h5 className="font-bold text-xs text-gray-800 dark:text-white">RSE & Impact</h5>
                                    <p className="text-xs text-gray-500">1h 15m • Nouveau</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-3 py-1.5 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition-colors">
                            Accéder au catalogue
                        </button>
                    </div>

                    {/* Internal Certifications */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 text-sm uppercase">Certifications Internes</h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded border border-yellow-200">Expert Java</span>
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded border border-indigo-200">Scrum Master</span>
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded border border-red-200">Secouriste</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded border border-gray-200">+ Ajouter</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Performance & Évaluation</h3>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Nouvelle Évaluation
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Campagne 2025</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-indigo-600 dark:text-white">45% des entretiens réalisés</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                    <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2">Objectifs Atteints</h4>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">78%</p>
                    <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">Moyenne globale</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                    <h4 className="font-bold text-green-800 dark:text-green-300 mb-2">Feedback 360°</h4>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-green-600 dark:text-green-400">15</span>
                        <span className="text-sm text-green-600 dark:text-green-400">Feedbacks reçus ce mois</span>
                    </div>
                </div>
            </div>

            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Entretiens & Objectifs</h4>
            <div className="space-y-4">
                {evaluations.map(evaluation => {
                    const emp = employees.find(e => e.id === evaluation.employeeId);
                    return (
                        <div key={evaluation.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
                                        {emp ? emp.username.substring(0, 2).toUpperCase() : '??'}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-gray-800 dark:text-white">{emp ? emp.username : 'Employé inconnu'}</h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{evaluation.type} - {evaluation.year}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    evaluation.status === 'Terminé' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                    evaluation.status === 'En cours' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' :
                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                }`}>
                                    {evaluation.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                                    <h6 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Objectifs</h6>
                                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                        {evaluation.goals.map((goal, idx) => (
                                            <li key={idx}>{goal}</li>
                                        ))}
                                    </ul>
                                    <button 
                                        onClick={() => {
                                            setEvalForGoal(evaluation);
                                            setNewGoalText('');
                                            setIsAddGoalModalOpen(true);
                                        }}
                                        className="mt-2 text-xs text-indigo-600 hover:underline flex items-center gap-1"
                                    >
                                        + Ajouter un objectif
                                    </button>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                                    <h6 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Feedback & Commentaires</h6>
                                    {evaluation.feedback.length > 0 ? (
                                        <ul className="space-y-2">
                                            {evaluation.feedback.map((fb, idx) => (
                                                <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-700 p-2 rounded">"{fb}"</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">Aucun feedback pour le moment.</p>
                                    )}
                                    <button 
                                        onClick={() => {
                                            setEvalForFeedback(evaluation);
                                            setNewFeedbackText('');
                                            setIsAddFeedbackModalOpen(true);
                                        }}
                                        className="mt-2 text-xs text-indigo-600 hover:underline flex items-center gap-1"
                                    >
                                        + Ajouter un feedback
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-3 border-t border-gray-100 dark:border-gray-600 pt-3">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Évaluateur: {evaluation.reviewer}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Date: {new Date(evaluation.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        );

      case 'wellbeing':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Bien-être & Climat Social</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Communication Interne */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                    Communication Interne
                  </h4>
                  <div className="space-y-4">
                    {posts.map(post => (
                      <div key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-800 dark:text-white">{post.author}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2">
                          <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            {post.likes} J'aime
                          </button>
                          <button className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            {post.comments.length} Commentaires
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                        setNewPostContent('');
                        setIsNewPostModalOpen(true);
                    }}
                    className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 rounded-lg transition-colors font-medium"
                  >
                    Publier un message
                  </button>
                </div>

                {/* Sondages */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                  <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    Sondages en cours
                  </h4>
                  {polls.map(poll => (
                    <div key={poll.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
                      <h5 className="font-bold text-gray-800 dark:text-white mb-3">{poll.question}</h5>
                      <div className="space-y-2">
                        {poll.options.map(option => {
                          const totalVotes = Object.values(poll.votes).reduce((a, b) => a + b, 0);
                          const percentage = totalVotes === 0 ? 0 : Math.round((poll.votes[option] || 0) / totalVotes * 100);
                          return (
                            <div key={option} className="relative pt-1">
                              <div className="flex mb-2 items-center justify-between">
                                <div>
                                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200 dark:bg-purple-900 dark:text-purple-300">
                                    {option}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-semibold inline-block text-purple-600 dark:text-purple-300">
                                    {percentage}%
                                  </span>
                                </div>
                              </div>
                              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200 dark:bg-purple-900">
                                <div style={{ width: `${percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                              </div>
                              <button 
                                onClick={() => {
                                    const newVotes = { ...poll.votes, [option]: (poll.votes[option] || 0) + 1 };
                                    setPolls(polls.map(p => p.id === poll.id ? { ...p, votes: newVotes } : p));
                                }}
                                className="text-xs text-purple-600 hover:underline"
                              >
                                Voter
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signalement & Activités */}
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                  <h4 className="font-bold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Signalement
                  </h4>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Signalez un problème matériel, un conflit ou une suggestion d'amélioration (anonyme possible).</p>
                    <button 
                        onClick={() => {
                            setNewIssueType('Matériel');
                            setNewIssueDesc('');
                            setIsNewIssueModalOpen(true);
                        }}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                        Faire un signalement
                    </button>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-bold text-gray-700 dark:text-gray-300 text-sm">Derniers signalements</h5>
                    {issues.map(issue => (
                        <div key={issue.id} className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700 text-sm">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-red-600 dark:text-red-400">{issue.type}</span>
                                <span className="text-xs text-gray-500">{new Date(issue.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{issue.description}</p>
                            <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">{issue.status}</span>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                    <h4 className="font-bold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Activités
                    </h4>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <h5 className="font-bold text-gray-800 dark:text-white">Yoga du Mardi</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Tous les mardis à 12h30</p>
                        <button className="text-xs text-green-600 hover:underline">S'inscrire</button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'discipline':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Gestion des Conflits & Médiation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Résolution de conflits, médiation et suivi disciplinaire</p>
              </div>
              <button 
                onClick={() => {
                    setNewCaseEmpId('');
                    setNewCaseType('');
                    setNewCaseDesc('');
                    setIsNewCaseModalOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Nouveau Dossier Confidentiel
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                    <div className="text-orange-600 dark:text-orange-400 text-sm font-bold uppercase mb-1">Médiations en cours</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                        {disciplinaryCases.filter(c => c.status === 'Médiation').length}
                    </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                    <div className="text-red-600 dark:text-red-400 text-sm font-bold uppercase mb-1">Cas Sensibles</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                        {disciplinaryCases.filter(c => c.severity === 'Grave').length}
                    </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                    <div className="text-green-600 dark:text-green-400 text-sm font-bold uppercase mb-1">Résolus (Mois)</div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">
                        {disciplinaryCases.filter(c => c.status === 'Clôturé').length}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Case List */}
                <div className="lg:col-span-2 space-y-6">
                    {disciplinaryCases.map(dCase => {
                        const emp = employees.find(e => e.id === dCase.employeeId);
                        return (
                            <div key={dCase.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700/50">
                                <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                                            dCase.severity === 'Grave' ? 'bg-red-600' : 
                                            dCase.severity === 'Moyenne' ? 'bg-orange-500' : 'bg-yellow-500'
                                        }`}>
                                            {dCase.severity === 'Grave' ? '!' : '?'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-800 dark:text-white text-lg">{dCase.type}</h4>
                                                <span className="bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                                    Confidentiel
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Employé: <span className="font-semibold text-gray-700 dark:text-gray-300">{emp ? emp.username : 'Inconnu'}</span> • Date: {new Date(dCase.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select 
                                            value={dCase.status}
                                            onChange={(e) => setDisciplinaryCases(disciplinaryCases.map(c => c.id === dCase.id ? { ...c, status: e.target.value } : c))}
                                            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        >
                                            <option value="Nouveau">Nouveau</option>
                                            <option value="En cours">En cours</option>
                                            <option value="Médiation">Médiation</option>
                                            <option value="Sanctionné">Sanctionné</option>
                                            <option value="Clôturé">Clôturé</option>
                                        </select>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            dCase.status === 'Clôturé' ? 'bg-gray-100 text-gray-600' :
                                            dCase.status === 'Médiation' ? 'bg-purple-100 text-purple-800' :
                                            dCase.status === 'Sanctionné' ? 'bg-red-100 text-red-800' :
                                            'bg-indigo-100 text-indigo-800'
                                        }`}>
                                            {dCase.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-gray-700 dark:text-gray-300 mb-4 bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-600 italic">
                                        "{dCase.description}"
                                    </p>
                                    
                                    <div className="space-y-3">
                                        <h5 className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase flex justify-between items-center">
                                            <span>Journal de Médiation & Actions</span>
                                            <span className="text-xs font-normal normal-case bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                                {dCase.actions.length} entrée(s)
                                            </span>
                                        </h5>
                                        
                                        <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-600 space-y-4">
                                            {dCase.actions.length > 0 ? (
                                                dCase.actions.map((action, idx) => (
                                                    <div key={idx} className="relative">
                                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-500 border-2 border-white dark:border-gray-800"></div>
                                                        <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-600 shadow-sm">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className={`font-bold text-sm ${
                                                                    action.type.includes('Sanction') ? 'text-red-600' : 
                                                                    action.type.includes('Réunion') ? 'text-purple-600' : 'text-gray-800 dark:text-white'
                                                                }`}>{action.type}</span>
                                                                <span className="text-xs text-gray-400">{new Date(action.date).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300">{action.description}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400 italic pl-2">Aucune action enregistrée pour le moment.</p>
                                            )}
                                        </div>
                                        
                                        <div className="pt-4 flex flex-wrap gap-2">
                                            <button 
                                                onClick={() => {
                                                    setCaseForMediation(dCase);
                                                    setMediationDate('');
                                                    setIsMediationModalOpen(true);
                                                }}
                                                className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded text-xs font-medium border border-purple-200 transition-colors flex items-center gap-1"
                                            >
                                                📅 Planifier Réunion
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setCaseForNote(dCase);
                                                    setCaseNote('');
                                                    setIsCaseNoteModalOpen(true);
                                                }}
                                                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-medium border border-indigo-200 transition-colors flex items-center gap-1"
                                            >
                                                📝 Note Manager
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setCaseForSanction(dCase);
                                                    setSanctionDesc('');
                                                    setIsSanctionModalOpen(true);
                                                }}
                                                className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-medium border border-red-200 transition-colors"
                                            >
                                                ⚠️ Sanction
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar: Procedures & Templates */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Modèles de Documents
                        </h4>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200 rounded transition-colors flex justify-between items-center group">
                                <span>Protocole de médiation</span>
                                <span className="text-gray-400 group-hover:text-indigo-500">↓</span>
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200 rounded transition-colors flex justify-between items-center group">
                                <span>Convocation entretien</span>
                                <span className="text-gray-400 group-hover:text-indigo-500">↓</span>
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200 rounded transition-colors flex justify-between items-center group">
                                <span>Accord de confidentialité</span>
                                <span className="text-gray-400 group-hover:text-indigo-500">↓</span>
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200 rounded transition-colors flex justify-between items-center group">
                                <span>Compte-rendu d'incident</span>
                                <span className="text-gray-400 group-hover:text-indigo-500">↓</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800">
                        <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-3 text-sm uppercase">Charte de Médiation</h4>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-sm text-indigo-900 dark:text-indigo-200">
                                <span className="font-bold bg-indigo-200 dark:bg-indigo-800 w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0">1</span>
                                <span>Neutralité absolue du médiateur RH.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-indigo-900 dark:text-indigo-200">
                                <span className="font-bold bg-indigo-200 dark:bg-indigo-800 w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0">2</span>
                                <span>Confidentialité des échanges garantie.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-indigo-900 dark:text-indigo-200">
                                <span className="font-bold bg-indigo-200 dark:bg-indigo-800 w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0">3</span>
                                <span>Recherche de solutions amiables prioritaire.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-indigo-900 dark:text-indigo-200">
                                <span className="font-bold bg-indigo-200 dark:bg-indigo-800 w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0">4</span>
                                <span>Formalisation écrite des accords trouvés.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        );

      case 'attendance':
        // Helper to calculate duration
        const calculateDuration = (inTime, outTime) => {
            if (!outTime) return 'En cours';
            const [h1, m1] = inTime.split(':').map(Number);
            const [h2, m2] = outTime.split(':').map(Number);
            const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
            const hours = Math.floor(diff / 60);
            const minutes = diff % 60;
            return `${hours}h${minutes.toString().padStart(2, '0')}`;
        };

        // Helper to calculate overtime (assuming 8h day)
        const calculateOvertime = (inTime, outTime) => {
             if (!outTime) return '-';
             const [h1, m1] = inTime.split(':').map(Number);
             const [h2, m2] = outTime.split(':').map(Number);
             const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
             const standard = 8 * 60; // 8 hours
             if (diff > standard) {
                 const extra = diff - standard;
                 const h = Math.floor(extra / 60);
                 const m = extra % 60;
                 return `+${h}h${m.toString().padStart(2, '0')}`;
             }
             return '-';
        };

        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Gestion du Temps & Présence</h3>
                <div className="flex gap-2">
                    <button onClick={() => showNotification("Mode Scan QR Code activé")} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                        QR Code
                    </button>
                    <button onClick={() => {
                        const now = new Date();
                        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
                        showNotification(`Pointage enregistré à ${time}`);
                    }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 rounded-lg transition-colors flex items-center gap-2 font-medium shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Pointer (Web)
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                    <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase">Présents</p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-300">{clockIns.filter(c => !c.out).length} / {employees.length}</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 font-bold uppercase">Retards</p>
                    <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
                        {clockIns.filter(c => {
                            const [h, m] = c.in.split(':').map(Number);
                            return h > 9 || (h === 9 && m > 0); // Late if after 09:00
                        }).length}
                    </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                    <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase">Absents</p>
                    <p className="text-2xl font-bold text-red-800 dark:text-red-300">{employees.length - clockIns.length}</p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                    <p className="text-xs text-indigo-600 dark:text-white font-bold uppercase">Heures Sup (Cumul)</p>
                    <p className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">12h30</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pointage du Jour Table */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                            Pointages du {new Date().toLocaleDateString()}
                        </h4>
                        <button onClick={() => showNotification("Données exportées vers le module Paie")} className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Export Paie
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-3">Employé</th>
                                    <th className="px-4 py-3">Arrivée</th>
                                    <th className="px-4 py-3">Départ</th>
                                    <th className="px-4 py-3">Durée</th>
                                    <th className="px-4 py-3">H. Sup</th>
                                    <th className="px-4 py-3">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clockIns.map(clock => {
                                    const emp = employees.find(e => e.id === clock.employeeId);
                                    const isLate = parseInt(clock.in.split(':')[0]) > 9 || (parseInt(clock.in.split(':')[0]) === 9 && parseInt(clock.in.split(':')[1]) > 0);
                                    return (
                                        <tr key={clock.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                                {emp ? emp.username : 'Inconnu'}
                                            </td>
                                            <td className={`px-4 py-3 font-mono ${isLate ? 'text-red-600 font-bold' : ''}`}>{clock.in}</td>
                                            <td className="px-4 py-3 font-mono">{clock.out || '--:--'}</td>
                                            <td className="px-4 py-3">{calculateDuration(clock.in, clock.out)}</td>
                                            <td className="px-4 py-3 text-indigo-600 font-bold">{calculateOvertime(clock.in, clock.out)}</td>
                                            <td className="px-4 py-3">
                                                {isLate ? (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold">Retard</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">À l'heure</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Planning & Shifts */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-800 dark:text-white">Planning Équipes</h4>
                            <button className="text-xs text-indigo-600 hover:underline">Gérer</button>
                        </div>
                        <div className="space-y-3">
                            {schedules.map(schedule => {
                                const emp = employees.find(e => e.id === schedule.employeeId);
                                return (
                                    <div key={schedule.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-100 dark:border-gray-600">
                                        <p className="font-bold text-gray-800 dark:text-white text-sm mb-1">{emp ? emp.username : 'Inconnu'}</p>
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <span>Lun-Jeu: {schedule.monday}</span>
                                            <span>Ven: {schedule.friday}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
                        <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2">Justifications Requises</h4>
                        <p className="text-sm text-orange-700 dark:text-orange-400 mb-3">2 retards non justifiés cette semaine.</p>
                        <button className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium">
                            Envoyer rappels
                        </button>
                    </div>
                </div>
            </div>
          </div>
        );

      case 'culture':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-indigo-600 dark:text-white mb-2">Ben Yaacoub Company</h3>
                <p className="text-gray-600 dark:text-gray-300 italic">"Innover ensemble pour un avenir meilleur"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="text-4xl mb-4 opacity-80">🚀</div>
                    <h4 className="text-xl font-bold mb-2">Innovation</h4>
                    <p className="text-indigo-100 text-sm">Nous repoussons sans cesse les limites de la technologie pour créer de la valeur.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="text-4xl mb-4 opacity-80">🤝</div>
                    <h4 className="text-xl font-bold mb-2">Esprit d'Équipe</h4>
                    <p className="text-purple-100 text-sm">La collaboration et le soutien mutuel sont au cœur de notre réussite collective.</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="text-4xl mb-4 opacity-80">🌱</div>
                    <h4 className="text-xl font-bold mb-2">Responsabilité</h4>
                    <p className="text-green-100 text-sm">Nous agissons avec intégrité et nous engageons pour un impact positif durable.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                            Actualités & Annonces
                        </h4>
                        <div className="space-y-4">
                            {posts.filter(p => p.author === 'Direction' || p.author === "Comité d'entreprise").map(post => (
                                <div key={post.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold text-xl">
                                            📢
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h5 className="font-bold text-gray-800 dark:text-white">{post.author}</h5>
                                            <span className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">{post.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Événements à venir
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {events.map(event => (
                                <div key={event.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold px-2 py-1 bg-purple-100 text-purple-800 rounded-full">{event.type}</span>
                                        <span className="text-sm font-bold text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                                    </div>
                                    <h5 className="font-bold text-gray-800 dark:text-white mb-1">{event.title}</h5>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {event.location}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-200 dark:border-gray-700 h-full">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Espace Info & Ressources
                        </h4>
                        <div className="space-y-3">
                            {resources.map(resource => (
                                <div key={resource.id} className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-between group cursor-pointer hover:border-indigo-400 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-red-100 text-red-600 rounded flex items-center justify-center font-bold text-xs">
                                            {resource.type}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-white text-sm group-hover:text-indigo-600 transition-colors">{resource.title}</p>
                                            <p className="text-xs text-gray-500">{resource.size} • {new Date(resource.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                            <h5 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm mb-2">Besoin d'aide ?</h5>
                            <p className="text-xs text-indigo-600 dark:text-white mb-3">Contactez le support RH pour toute question administrative.</p>
                            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 text-xs font-bold rounded transition-colors">
                                Contacter RH
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        );

      case 'compensation':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Avantages & Compensations</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Avantages Sociaux */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                    <h4 className="font-bold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Avantages & Allocations
                    </h4>
                    <div className="space-y-3">
                        {benefits.map(benefit => (
                            <div key={benefit.id} className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white text-sm">{benefit.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Bénéficiaires: {benefit.beneficiaries}</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-green-600 dark:text-green-400 text-sm">{benefit.amount}</span>
                                    <p className="text-xs text-gray-400">{benefit.type}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={() => {
                            setNewBenefitName('');
                            setIsNewBenefitModalOpen(true);
                        }}
                        className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                        Ajouter un avantage
                    </button>
                </div>

                {/* Comparaison Marché */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        Comparaison Marché (Benchmark)
                    </h4>
                    <div className="space-y-4">
                        {marketData.map((data, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-gray-800 dark:text-white text-sm">{data.role}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${data.diff >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {data.diff > 0 ? '+' : ''}{data.diff}%
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>Interne: <span className="font-semibold text-gray-700 dark:text-gray-300">{data.companyAvg} DT</span></span>
                                    <span>Marché: <span className="font-semibold text-gray-700 dark:text-gray-300">{data.avg} DT</span></span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
                                    <div className={`h-1.5 rounded-full ${data.diff >= 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (data.companyAvg / data.avg) * 100)}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grilles Salariales */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        Grilles Salariales 2025
                    </h4>
                    <button className="text-sm text-indigo-600 hover:underline">Mettre à jour</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Niveau / Rôle</th>
                                <th scope="col" className="px-4 py-3">Salaire Min</th>
                                <th scope="col" className="px-4 py-3">Salaire Max</th>
                                <th scope="col" className="px-4 py-3">Devise</th>
                                <th scope="col" className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salaryGrids.map(grid => (
                                <tr key={grid.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{grid.role}</td>
                                    <td className="px-4 py-3">{grid.min}</td>
                                    <td className="px-4 py-3">{grid.max}</td>
                                    <td className="px-4 py-3">{grid.currency}</td>
                                    <td className="px-4 py-3">
                                        <button className="text-indigo-600 hover:underline">Éditer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        );

      case 'sst':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Santé, Sécurité & Conditions de Travail (SST)</h3>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                    <p className="text-xs text-red-600 dark:text-red-400 font-bold uppercase">Accidents (Année)</p>
                    <p className="text-2xl font-bold text-red-800 dark:text-red-300">{accidents.length}</p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                    <p className="text-xs text-indigo-600 dark:text-white font-bold uppercase">Visites Médicales</p>
                    <p className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">{medicalVisits.filter(v => v.status === 'Planifié').length} à venir</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 font-bold uppercase">Risques Identifiés</p>
                    <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{risks.length}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                    <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase">Formations Sécurité</p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-300">{safetyTrainings.filter(t => t.status === 'Planifié').length} prévues</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Accidents de Travail */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            Accidents de Travail
                        </h4>
                        <button className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors">Déclarer</button>
                    </div>
                    <div className="space-y-3">
                        {accidents.map(acc => {
                            const emp = employees.find(e => e.id === acc.employeeId);
                            return (
                                <div key={acc.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-100 dark:border-gray-600">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-gray-800 dark:text-white">{emp ? emp.username : 'Inconnu'}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${acc.severity === 'Haute' ? 'bg-red-100 text-red-800' : acc.severity === 'Moyenne' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>{acc.severity}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{acc.description}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>{new Date(acc.date).toLocaleDateString()} • {acc.type}</span>
                                        <span className="font-medium">{acc.status}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Suivi Médical */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Suivi Médical
                        </h4>
                        <button className="text-sm text-indigo-600 hover:underline">Planifier visite</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-2">Employé</th>
                                    <th className="px-4 py-2">Type</th>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Statut</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicalVisits.map(visit => {
                                    const emp = employees.find(e => e.id === visit.employeeId);
                                    return (
                                        <tr key={visit.id} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{emp ? emp.username : 'Inconnu'}</td>
                                            <td className="px-4 py-2">{visit.type}</td>
                                            <td className="px-4 py-2">{new Date(visit.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${visit.status === 'Effectué' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                                    {visit.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Analyse des Risques */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Analyse des Risques (DUERP)
                    </h4>
                    <div className="space-y-3">
                        {risks.map(risk => (
                            <div key={risk.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded border border-yellow-100 dark:border-yellow-800">
                                <div className="flex justify-between mb-1">
                                    <span className="font-bold text-gray-800 dark:text-white">{risk.category}</span>
                                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">Prob: {risk.probability} • Impact: {risk.impact}</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{risk.description}</p>
                                <div className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-yellow-200 dark:border-yellow-700 text-gray-600 dark:text-gray-400">
                                    <strong>Mitigation:</strong> {risk.mitigation}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Formations Sécurité */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        Formations Sécurité
                    </h4>
                    <div className="space-y-3">
                        {safetyTrainings.map(training => (
                            <div key={training.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-100 dark:border-gray-600">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white">{training.title}</p>
                                    <p className="text-xs text-gray-500">{new Date(training.date).toLocaleDateString()} • {Array.isArray(training.participants) ? `${training.participants.length} participants` : training.participants}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${training.status === 'Effectué' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                    {training.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800">
                        <h5 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm mb-1">Documentation SST</h5>
                        <p className="text-xs text-indigo-600 dark:text-white mb-2">Accédez aux procédures d'urgence et fiches de sécurité.</p>
                        <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 px-3 py-1 rounded transition-colors">Voir Documents</button>
                    </div>
                </div>
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Pilotage Stratégique RH</h3>
            
            {/* Budget Section */}
            <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Budget RH Annuel</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Masse Salariale</span>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">75%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mb-2">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                            <span>Utilisé: 750k DT</span>
                            <span>Total: 1M DT</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Formation</span>
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mb-2">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                            <span>Utilisé: 22.5k DT</span>
                            <span>Total: 50k DT</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Recrutement</span>
                            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">60%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mb-2">
                            <div className="bg-orange-500 h-2.5 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                            <span>Utilisé: 18k DT</span>
                            <span>Total: 30k DT</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Taux de Turnover</div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-800 dark:text-white">12.5%</span>
                        <span className="text-red-500 text-sm font-medium mb-1">↑ +2%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Moyenne secteur: 10%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Absentéisme</div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-800 dark:text-white">4.2%</span>
                        <span className="text-green-500 text-sm font-medium mb-1">↓ -0.5%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Objectif: &lt; 5%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Satisfaction (eNPS)</div>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-bold text-gray-800 dark:text-white">+42</span>
                        <span className="text-indigo-500 text-sm font-medium mb-1">Stable</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Excellent &gt; 30</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Workforce Planning */}
                <div>
                    <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Planification des Effectifs (Q1 2026)</h4>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-4 py-2">Poste</th>
                                    <th className="px-4 py-2">Département</th>
                                    <th className="px-4 py-2">Priorité</th>
                                    <th className="px-4 py-2">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">Dev Senior</td>
                                    <td className="px-4 py-3 text-gray-500">Tech</td>
                                    <td className="px-4 py-3"><span className="text-red-600 font-bold text-xs">Haute</span></td>
                                    <td className="px-4 py-3"><span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">En cours</span></td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">Commercial</td>
                                    <td className="px-4 py-3 text-gray-500">Sales</td>
                                    <td className="px-4 py-3"><span className="text-orange-500 font-bold text-xs">Moyenne</span></td>
                                    <td className="px-4 py-3"><span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">À valider</span></td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">RH Assistant</td>
                                    <td className="px-4 py-3 text-gray-500">RH</td>
                                    <td className="px-4 py-3"><span className="text-green-500 font-bold text-xs">Basse</span></td>
                                    <td className="px-4 py-3"><span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Planifié</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Predictive Analytics */}
                <div>
                    <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Analyses Prédictives</h4>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-100 dark:border-purple-800 mb-4">
                        <h5 className="font-bold text-purple-800 dark:text-purple-300 mb-2 text-sm">⚠️ Risques de Départ Identifiés</h5>
                        <p className="text-sm text-purple-900 dark:text-purple-200 mb-3">
                            L'analyse des données suggère un risque élevé de départ dans l'équipe <strong>Tech</strong> d'ici 3 mois (surcharge de travail détectée).
                        </p>
                        <button 
                            onClick={() => {
                                setReportType('risks');
                                setIsReportModalOpen(true);
                            }}
                            className="text-xs bg-white dark:bg-gray-800 text-purple-600 px-3 py-1 rounded border border-purple-200 shadow-sm hover:bg-purple-50"
                        >
                            Voir le rapport détaillé
                        </button>
                    </div>
                    
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800">
                        <h5 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2 text-sm">📈 Besoins Futurs en Compétences</h5>
                        <ul className="space-y-2 text-sm text-indigo-900 dark:text-indigo-200">
                            <li className="flex justify-between">
                                <span>Intelligence Artificielle</span>
                                <span className="font-bold">+15% demande</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Cybersécurité</span>
                                <span className="font-bold">+10% demande</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Gestion de Projet Agile</span>
                                <span className="font-bold">+5% demande</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        );

      case 'branding':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Marque Employeur & Communication</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rayonnement interne et externe de l'entreprise</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    + Nouvelle Publication
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Internal Communication Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-200 dark:border-gray-600">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="text-xl">📢</span> Communication Interne
                        </h4>
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded">Annonce</span>
                                    <span className="text-xs text-gray-400">Il y a 2 heures</span>
                                </div>
                                <h5 className="font-bold text-gray-800 dark:text-white mb-1">Lancement du projet "Green Office" 🌿</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                    Nous sommes ravis d'annoncer notre nouvelle initiative écologique. Des bacs de recyclage sont désormais disponibles à chaque étage.
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">❤️ 12 J'aime</span>
                                    <span className="flex items-center gap-1">💬 3 Commentaires</span>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-600 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">Événement</span>
                                    <span className="text-xs text-gray-400">Hier</span>
                                </div>
                                <h5 className="font-bold text-gray-800 dark:text-white mb-1">Afterwork Jeudi Prochain ! 🎉</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                    Rejoignez-nous pour un moment de convivialité sur le rooftop à partir de 18h. Inscriptions ouvertes.
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">❤️ 24 J'aime</span>
                                    <span className="flex items-center gap-1">💬 8 Commentaires</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Onboarding Section */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-600">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="text-xl">👋</span> Intégration des Nouveaux (Onboarding)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">S</div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-sm text-gray-800 dark:text-white">Sarah Ben Ali</span>
                                        <span className="text-xs text-indigo-600">Semaine 1</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-600">
                                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{width: '25%'}}></div>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1 block">Parcours d'intégration: 25%</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">M</div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-sm text-gray-800 dark:text-white">Mohamed K.</span>
                                        <span className="text-xs text-green-600">Mois 1</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-600">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{width: '80%'}}></div>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1 block">Parcours d'intégration: 80%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Social & Events */}
                <div className="space-y-6">
                    {/* Social Media Strategy */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-800">
                        <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-4 text-sm uppercase">Réseaux Sociaux</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-indigo-600 text-xl">in</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-800 dark:text-white">12.5k</div>
                                    <div className="text-xs text-green-600">+120 abonnés</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-indigo-400 text-xl">fb</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-800 dark:text-white">8.2k</div>
                                    <div className="text-xs text-green-600">+45 abonnés</div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-indigo-200 dark:border-indigo-800">
                                <p className="text-xs text-indigo-800 dark:text-indigo-300 mb-2 font-bold">Prochain Post:</p>
                                <div className="bg-white dark:bg-gray-800 p-2 rounded text-xs text-gray-600 dark:text-gray-300 border border-indigo-100 dark:border-indigo-900">
                                    "Retour en images sur notre Hackathon 2025 🚀"
                                    <br/>
                                    <span className="text-gray-400 italic">Prévu: Demain 10h</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 text-sm uppercase">Événements & Team Building</h4>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <div className="bg-orange-100 text-orange-800 rounded-lg w-12 h-12 flex flex-col items-center justify-center shrink-0">
                                    <span className="text-xs font-bold">DEC</span>
                                    <span className="text-lg font-bold leading-none">15</span>
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm text-gray-800 dark:text-white">Fête de fin d'année</h5>
                                    <p className="text-xs text-gray-500">Hôtel Africa • 19h00</p>
                                    <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded mt-1 inline-block">Confirmé</span>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <div className="bg-indigo-100 text-indigo-800 rounded-lg w-12 h-12 flex flex-col items-center justify-center shrink-0">
                                    <span className="text-xs font-bold">JAN</span>
                                    <span className="text-lg font-bold leading-none">10</span>
                                </div>
                                <div>
                                    <h5 className="font-bold text-sm text-gray-800 dark:text-white">Workshop Stratégie</h5>
                                    <p className="text-xs text-gray-500">Salle de réunion A • 09h00</p>
                                </div>
                            </li>
                        </ul>
                        <button className="w-full mt-4 py-2 text-xs text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-50 transition-colors">
                            Voir le calendrier complet
                        </button>
                    </div>

                    {/* Career Page Preview */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-100 dark:border-purple-800">
                        <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2 text-sm uppercase">Page Carrière</h4>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-purple-900 dark:text-purple-200">Vues ce mois</span>
                            <span className="font-bold text-purple-800 dark:text-white">1,240</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-purple-900 dark:text-purple-200">Candidatures</span>
                            <span className="font-bold text-purple-800 dark:text-white">45</span>
                        </div>
                        <button className="w-full mt-3 py-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors">
                            Gérer la page
                        </button>
                    </div>
                </div>
            </div>
          </div>
        );

      case 'offboarding':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Offboarding & Départs</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gestion des départs et formalités de sortie</p>
                </div>
                <button 
                    onClick={() => {
                        // Placeholder for Offboarding Modal - reusing notification for now as no specific modal requested for this simple action yet, 
                        // or could add a simple confirmation modal if needed. 
                        // Given instructions "pour tout les button dans le projet faire le en modal", let's make a simple input modal for this too.
                        // I'll reuse the "New Case" modal structure or similar, but since I didn't create a specific "Offboarding" modal state, 
                        // I will add one quickly or just use a generic one. 
                        // Actually, I missed creating a state for this one in the big block. 
                        // Let's just use a simple prompt replacement with a new state I'll inject or reuse an existing one if appropriate?
                        // No, I should create a new state. But I can't easily inject state now without reading the top again.
                        // Let's check if I have a generic "Input Modal". No.
                        // I will use the `isNewCaseModalOpen` as a template but I need a new state.
                        // Wait, I can just add the state definition at the top if I haven't.
                        // But for now, let's just show the notification to avoid breaking flow, or better, 
                        // let's add a `isOffboardingModalOpen` state.
                        // I'll add the state and the modal in the next steps.
                        // For this step, I will just change the onClick to use a new state `isOffboardingModalOpen` 
                        // and I will add the state definition and the modal JSX in a moment.
                        setIsOffboardingModalOpen(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2 text-sm font-medium"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Lancer une procédure
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
                    <h4 className="font-bold text-orange-800 dark:text-orange-300 mb-2">Départs en cours</h4>
                    <div className="flex items-center gap-3">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">3</div>
                        <div className="text-sm text-orange-600 dark:text-orange-400 leading-tight">Dossiers actifs<br/>ce mois</div>
                    </div>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
                    <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Matériel Récupéré</h4>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-3xl font-bold text-indigo-600 dark:text-white">85%</span>
                        <span className="text-sm text-indigo-600 dark:text-white mb-1">Sur les dossiers clos</span>
                    </div>
                    <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                    <h4 className="font-bold text-gray-800 dark:text-gray-300 mb-2">Entretiens de Départ</h4>
                    <div className="flex items-center gap-3">
                        <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">100%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 leading-tight">Réalisés<br/>(Trimestre en cours)</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Offboarding List */}
                <div className="lg:col-span-2 space-y-6">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        Dossiers de Sortie
                    </h4>
                    
                    {/* Example Item 1 */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                                    JD
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-800 dark:text-white">Jean Dupont</h5>
                                    <p className="text-xs text-gray-500">Départ le: 15/12/2025 • Motif: Démission</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">En cours</span>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" checked readOnly className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 line-through opacity-70">Lettre de démission reçue</span>
                                </div>
                                <span className="text-xs text-green-600 font-bold">Fait</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Récupération du matériel</span>
                                </div>
                                <button className="text-xs text-indigo-600 hover:underline">Checklist</button>
                            </div>

                            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Entretien de départ</span>
                                </div>
                                <button className="text-xs text-indigo-600 hover:underline">Planifier</button>
                            </div>

                            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Documents de sortie (STC, Attestation)</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded hover:bg-gray-300 transition-colors">Générer STC</button>
                                    <button className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded hover:bg-gray-300 transition-colors">Attestation</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Tools & Templates */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 text-sm uppercase">Documents & Modèles</h4>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200 rounded transition-colors flex justify-between items-center group">
                                <span>Attestation de travail</span>
                                <span className="text-gray-400 group-hover:text-indigo-500">↓</span>
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200 rounded transition-colors flex justify-between items-center group">
                                <span>Reçu pour solde de tout compte</span>
                                <span className="text-gray-400 group-hover:text-indigo-500">↓</span>
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200 rounded transition-colors flex justify-between items-center group">
                                <span>Checklist de sortie</span>
                                <span className="text-gray-400 group-hover:text-indigo-500">↓</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-100 dark:border-purple-800">
                        <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-3 text-sm uppercase">Entretien de Départ</h4>
                        <p className="text-xs text-purple-900 dark:text-purple-200 mb-3">
                            L'entretien de départ est crucial pour comprendre les raisons du départ et améliorer la rétention.
                        </p>
                        <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded transition-colors">
                            Voir le guide d'entretien
                        </button>
                    </div>
                </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Rapports & Analytique</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Rapport d'Absences</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Analysez les tendances d'absentéisme par département et par période.</p>
                <button 
                  onClick={() => {
                    setReportType('absences');
                    setIsReportModalOpen(true);
                  }}
                  className="w-full py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Générer PDF
                </button>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Rapport de Paie</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Synthèse des salaires, primes et cotisations sociales du mois.</p>
                <button 
                  onClick={() => {
                    setReportType('payroll');
                    setIsReportModalOpen(true);
                  }}
                  className="w-full py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Générer Excel
                </button>
              </div>
            </div>
          </div>
        );


      case 'documents':
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Mes Documents</h3>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Fiches de Paie</h4>
              {myPayslips.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Aucune fiche de paie disponible.</p>
              ) : (
                <div className="space-y-3">
                  {myPayslips.map(payslip => (
                    <div key={payslip.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-lg">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 dark:text-white">{payslip.month} {payslip.year}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Fiche de paie</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded transition-colors">
                        Télécharger
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Autres Documents</h4>
              <div className="space-y-3">
                {resources.map(resource => (
                  <div key={resource.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">{resource.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{resource.type} • {resource.size}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-sm font-bold rounded transition-colors">
                      Voir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'tickets':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Tickets & Demandes RH</h3>
              <button 
                onClick={() => setIsNewIssueModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
              >
                + Nouveau Ticket
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {issues.map(issue => (
                <div key={issue.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      issue.status === 'En cours' ? 'bg-orange-100 text-orange-800' : 
                      issue.status === 'Résolu' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {issue.status}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{issue.date}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-white mb-1">{issue.type}</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{issue.description}</p>
                </div>
              ))}
              {issues.length === 0 && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                  Aucun ticket en cours.
                </div>
              )}
            </div>
          </div>
        );

      case 'attendance_emp':
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Pointage et Heures</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Aujourd'hui</h4>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{todayClockIn?.in || '--:--'}</div>
                    <p className="text-gray-500 dark:text-gray-400">Heure d'arrivée</p>
                  </div>
                  <div className="mx-8 text-gray-300 dark:text-gray-600 text-2xl">→</div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-400 dark:text-gray-600 mb-2">{todayClockIn?.out || '--:--'}</div>
                    <p className="text-gray-500 dark:text-gray-400">Heure de départ</p>
                  </div>
                </div>
                {!todayClockIn ? (
                  <button onClick={handleClockIn} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-all">
                    Badger Entrée
                  </button>
                ) : !todayClockIn.out ? (
                  <button onClick={handleClockOut} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-all">
                    Badger Sortie
                  </button>
                ) : (
                  <button disabled className="w-full py-3 bg-gray-400 text-white font-bold rounded-lg shadow-lg cursor-not-allowed">
                    Journée terminée
                  </button>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Historique Récent</h4>
                <div className="space-y-3">
                  {clockIns.filter(c => c.employeeId === (user?.id || 1)).slice(0, 5).map(clock => (
                    <div key={clock.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                      <span className="font-medium text-gray-800 dark:text-white">{clock.date}</span>
                      <div className="text-sm">
                        <span className="text-green-600 font-bold">{clock.in}</span>
                        <span className="mx-2 text-gray-400">-</span>
                        <span className="text-red-600 font-bold">{clock.out || 'En cours'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'training_emp':
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Mes Formations</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {trainings.filter(t => t.participants.includes(user?.id || 1)).map(training => (
                <div key={training.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white">{training.title}</h4>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        training.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                        training.status === 'En cours' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>{training.status}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Type: {training.type} • Durée: {training.duration}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Date: {training.date}</p>
                  </div>
                  <button onClick={() => { setSelectedTraining(training); setIsTrainingModalOpen(true); }} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-lg transition-colors">
                    Détails
                  </button>
                </div>
              ))}
              {trainings.filter(t => t.participants.includes(user?.id || 1)).length === 0 && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                  Aucune formation assignée.
                </div>
              )}
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Objectifs & Évaluations</h3>
            
            <div className="grid grid-cols-1 gap-6">
              {evaluations.filter(e => e.employeeId === (user?.id || 1)).map(evaluation => (
                <div key={evaluation.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white">Évaluation {evaluation.type} {evaluation.year}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Evaluateur: {evaluation.reviewer} • Date: {evaluation.date}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      evaluation.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>{evaluation.status}</span>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="font-bold text-gray-700 dark:text-gray-300 mb-2 text-sm uppercase">Objectifs</h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                      {evaluation.goals.map((goal, idx) => (
                        <li key={idx}>{goal}</li>
                      ))}
                    </ul>
                    <button onClick={() => { setSelectedEvaluation(evaluation); setIsEvaluationModalOpen(true); }} className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">Voir les détails &rarr;</button>
                  </div>

                  {evaluation.feedback.length > 0 && (
                    <div>
                      <h5 className="font-bold text-gray-700 dark:text-gray-300 mb-2 text-sm uppercase">Feedback</h5>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded text-sm text-gray-600 dark:text-gray-300 italic">
                        "{evaluation.feedback[0]}"
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Actualités & Annonces</h3>
            
            <div className="grid grid-cols-1 gap-6">
              {posts.map(post => (
                <div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-white">{post.author}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{post.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <button onClick={() => handleLikePost(post.id)} className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                      <span>❤️</span> {post.likes} J'aime
                    </button>
                    <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                      <span>💬</span> {post.comments.length} Commentaires
                    </button>
                  </div>
                  {visibleComments[post.id] && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
                      <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Commentaires</h5>
                      <div className="space-y-2">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded text-sm text-gray-600 dark:text-gray-300">{comment}</div>
                        ))}
                        <div className="flex gap-2 mt-2">
                          <input type="text" placeholder="Votre commentaire..." className="flex-1 text-sm p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                          <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">Envoyer</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Paramètres</h3>
            <div className="mb-4">
              <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-indigo-600" /> 
                <span>Notifications Email</span>
              </label>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Changer Mot de Passe</button>
          </div>
        );

      default:
        return <div>Page non trouvée</div>;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-white animate-fade-in">Ben Yaacoub Company</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Portail RH</p>
        </header>
        <main className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl animate-slide-up">
          <Login onLogin={handleLogin} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        <div className={`w-64 shadow-lg flex flex-col z-20 transition-colors duration-300 ${isHR ? 'bg-slate-900 text-white' : 'bg-white dark:bg-gray-800'}`}>
          <div className={`p-6 text-xl font-bold border-b ${isHR ? 'text-white border-slate-700' : 'text-indigo-600 dark:text-white border-gray-200 dark:border-gray-700'}`}>
            Ben Yaacoub Co.
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              <li className={`px-6 py-3 cursor-pointer transition-colors ${
                currentPage === 'dashboard' 
                  ? (isHR ? 'bg-slate-800 text-white border-r-4 border-indigo-500' : 'bg-indigo-50 dark:bg-gray-700 border-r-4 border-indigo-500 text-indigo-600 dark:text-white') 
                  : (isHR ? 'text-white hover:bg-slate-800 hover:text-gray-200' : 'text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200')
              }`} onClick={() => setCurrentPage('dashboard')}>Tableau de bord</li>
              
              {isHR ? (
                <>
                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'employees' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('employees')}>Gestion Employés</li>
                  
                  <li className={`px-6 py-3 cursor-pointer transition-colors flex justify-between items-center ${
                    currentPage === 'validations' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('validations')}>
                    <span>Validations</span>
                    {leaveRequests.filter(r => r.status === 'pending').length > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{leaveRequests.filter(r => r.status === 'pending').length}</span>
                    )}
                  </li>
                  
                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'recruitment' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('recruitment')}>Recrutement</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'payroll' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('payroll')}>Paie</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'compensation' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('compensation')}>Compensations</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'attendance' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('attendance')}>Présence</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'training' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('training')}>Formation</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'performance' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('performance')}>Performance</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'wellbeing' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('wellbeing')}>Bien-être</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'discipline' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('discipline')}>Discipline</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'sst' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('sst')}>Santé & Sécurité</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'culture' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('culture')}>Culture & Info</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'strategy' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('strategy')}>Pilotage Stratégique</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'branding' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('branding')}>Marque Employeur</li>
                  
                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'reports' 
                      ? 'bg-slate-800 text-white border-r-4 border-indigo-500' 
                      : 'text-white hover:bg-slate-800 hover:text-gray-200'
                  }`} onClick={() => setCurrentPage('reports')}>Rapports</li>
                </>
                            ) : (
                <>
                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'profile' 
                      ? 'bg-indigo-50 dark:bg-gray-700 border-r-4 border-indigo-500 text-indigo-600 dark:text-white' 
                      : 'text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200'
                  }`} onClick={() => setCurrentPage('profile')}>1. Profil salarié</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors flex justify-between items-center ${
                    currentPage === 'leave_requests' 
                      ? 'bg-indigo-50 dark:bg-gray-700 border-r-4 border-indigo-500 text-indigo-600 dark:text-white' 
                      : 'text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200'
                  }`} onClick={() => { setCurrentPage('leave_requests'); markAsSeen('leave'); }}>
                    <span>2. Congés et absences</span>
                    {notifications.leave > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{notifications.leave}</span>}
                  </li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'documents' 
                      ? 'bg-indigo-50 dark:bg-gray-700 border-r-4 border-indigo-500 text-indigo-600 dark:text-white' 
                      : 'text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200'
                  }`} onClick={() => setCurrentPage('documents')}>3. Mes documents</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'tickets' 
                      ? 'bg-indigo-50 dark:bg-gray-700 border-r-4 border-indigo-500 text-indigo-600 dark:text-white' 
                      : 'text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200'
                  }`} onClick={() => setCurrentPage('tickets')}>4. Tickets & RH</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'attendance_emp' 
                      ? 'bg-indigo-50 dark:bg-gray-700 border-r-4 border-indigo-500 text-indigo-600 dark:text-white' 
                      : 'text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200'
                  }`} onClick={() => setCurrentPage('attendance_emp')}>5. Pointage et heures</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'training_emp' 
                      ? 'bg-indigo-50 dark:bg-gray-700 border-r-4 border-indigo-500 text-indigo-600 dark:text-white' 
                      : 'text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200'
                  }`} onClick={() => setCurrentPage('training_emp')}>6. Formation</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'goals' 
                      ? 'bg-indigo-50 dark:bg-gray-700 border-r-4 border-indigo-500 text-indigo-600 dark:text-white' 
                      : 'text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200'
                  }`} onClick={() => setCurrentPage('goals')}>7. Objectifs personnels</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    currentPage === 'news' 
                      ? 'bg-indigo-50 dark:bg-gray-700 border-r-4 border-indigo-500 text-indigo-600 dark:text-white' 
                      : 'text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200'
                  }`} onClick={() => setCurrentPage('news')}>8. Actualités</li>

                  <li className={`px-6 py-3 cursor-pointer transition-colors ${
                    isChatOpen 
                      ? 'bg-indigo-50 dark:bg-gray-700 border-r-4 border-indigo-500 text-indigo-600 dark:text-white' 
                      : 'text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200'
                  }`} onClick={() => setIsChatOpen(true)}>9. Chat RH</li>
                </>
              )}
              <li className={`px-6 py-3 cursor-pointer transition-colors ${
                currentPage === 'settings' 
                  ? (isHR ? 'bg-slate-800 text-white border-r-4 border-indigo-500' : 'bg-indigo-50 dark:bg-gray-700 border-r-4 border-indigo-500 text-indigo-600 dark:text-white') 
                  : (isHR ? 'text-white hover:bg-slate-800 hover:text-gray-200' : 'text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:pl-8 transition-all duration-200')
              }`} onClick={() => setCurrentPage('settings')}>Paramètres</li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <header className="bg-white dark:bg-gray-800 shadow-sm z-10 p-4 flex justify-between items-center transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{isHR ? 'Tableau de Bord RH' : `Bienvenue, ${user.username}`}</h2>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
              >
                {darkMode ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 24.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                )}
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Déconnexion</button>
            </div>
          </header>
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 transition-colors duration-300">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Floating Chatbot */}
      {isChatOpen ? (
        <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-slide-up border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <ChatWindow user={user} onClose={() => setIsChatOpen(false)} />
        </div>
      ) : (
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-transform hover:scale-110 z-50" onClick={() => setIsChatOpen(true)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </button>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-24 right-6 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-fade-in z-50">
          {notification}
        </div>
      )}

      {/* --- MODALS --- */}

      {/* Edit Employee Modal */}
      {isEditEmployeeModalOpen && editingEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Modifier l'employé</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Poste</label>
                <input type="text" value={editEmployeeRole} onChange={(e) => setEditEmployeeRole(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Département</label>
                <input type="text" value={editEmployeeDept} onChange={(e) => setEditEmployeeDept(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsEditEmployeeModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, role: editEmployeeRole, department: editEmployeeDept } : e));
                setSelectedEmployee({ ...editingEmployee, role: editEmployeeRole, department: editEmployeeDept });
                showNotification("Employé mis à jour");
                setIsEditEmployeeModalOpen(false);
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Sauvegarder</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {isAddDocModalOpen && docEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Ajouter un document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom du document</label>
                <input type="text" value={newDocName} onChange={(e) => setNewDocName(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select value={newDocType} onChange={(e) => setNewDocType(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="Contrat">Contrat</option>
                  <option value="CIN">CIN</option>
                  <option value="Diplôme">Diplôme</option>
                  <option value="Attestation">Attestation</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsAddDocModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (newDocName) {
                  const newDoc = { name: newDocName, type: newDocType, archived: false };
                  const updatedEmp = { ...docEmployee, documents: [...docEmployee.documents, newDoc] };
                  setEmployees(employees.map(e => e.id === docEmployee.id ? updatedEmp : e));
                  setSelectedEmployee(updatedEmp);
                  showNotification("Document ajouté");
                  setIsAddDocModalOpen(false);
                  setNewDocName('');
                }
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* Download Modal */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Télécharger</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Téléchargement de <strong>{downloadDocName}</strong>...</p>
            <button onClick={() => setIsDownloadModalOpen(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">OK</button>
          </div>
        </div>
      )}

      {/* Reject Request Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Motif du refus</h3>
            <textarea 
              value={rejectReason} 
              onChange={(e) => setRejectReason(e.target.value)} 
              placeholder="Veuillez indiquer la raison du refus..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white h-32"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (rejectReason) {
                  if (rejectRequestType === 'leave') {
                    handleUpdateLeaveStatus(rejectRequestId, 'rejected', rejectReason);
                  } else if (rejectRequestType === 'payslip') {
                    handleUpdatePayslipStatus(rejectRequestId, 'rejected'); 
                  } else if (rejectRequestType === 'absence') {
                    handleUpdateAbsenceStatus(rejectRequestId, 'rejected', rejectReason);
                  }
                  setIsRejectModalOpen(false);
                  setRejectReason('');
                }
              }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Refuser</button>
            </div>
          </div>
        </div>
      )}

      {/* Training Need Modal */}
      {isTrainingNeedModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nouveau besoin de formation</h3>
            <input type="text" value={newTrainingNeed} onChange={(e) => setNewTrainingNeed(e.target.value)} placeholder="Description du besoin" className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsTrainingNeedModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (newTrainingNeed) {
                  showNotification("Besoin ajouté au plan de formation");
                  setIsTrainingNeedModalOpen(false);
                  setNewTrainingNeed('');
                }
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* New Training Modal */}
      {isNewTrainingModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nouvelle Session de Formation</h3>
            <input type="text" value={newTrainingTitle} onChange={(e) => setNewTrainingTitle(e.target.value)} placeholder="Titre de la formation" className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsNewTrainingModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (newTrainingTitle) {
                  const newTraining = { 
                    id: trainings.length + 1, 
                    title: newTrainingTitle, 
                    type: "Interne", 
                    duration: "1 jour", 
                    participants: [], 
                    status: "Planifié", 
                    date: "2026-01-01" 
                  };
                  setTrainings([...trainings, newTraining]);
                  showNotification("Formation créée");
                  setIsNewTrainingModalOpen(false);
                  setNewTrainingTitle('');
                }
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Créer</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Participant Modal */}
      {isAddParticipantModalOpen && trainingToAddTo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Ajouter un participant</h3>
            <input type="number" value={participantIdToAdd} onChange={(e) => setParticipantIdToAdd(e.target.value)} placeholder="ID de l'employé" className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAddParticipantModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                const empId = parseInt(participantIdToAdd);
                if (employees.find(e => e.id === empId)) {
                  setTrainings(trainings.map(t => t.id === trainingToAddTo.id ? { ...t, participants: [...t.participants, empId] } : t));
                  showNotification("Participant ajouté");
                  setIsAddParticipantModalOpen(false);
                  setParticipantIdToAdd('');
                } else {
                  showNotification("Employé introuvable");
                }
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddGoalModalOpen && evalForGoal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nouvel Objectif</h3>
            <input type="text" value={newGoalText} onChange={(e) => setNewGoalText(e.target.value)} placeholder="Description de l'objectif" className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAddGoalModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (newGoalText) {
                  setEvaluations(evaluations.map(ev => ev.id === evalForGoal.id ? { ...ev, goals: [...ev.goals, newGoalText] } : ev));
                  showNotification("Objectif ajouté");
                  setIsAddGoalModalOpen(false);
                  setNewGoalText('');
                }
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Feedback Modal */}
      {isAddFeedbackModalOpen && evalForFeedback && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Ajouter un Feedback</h3>
            <textarea value={newFeedbackText} onChange={(e) => setNewFeedbackText(e.target.value)} placeholder="Votre feedback..." className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAddFeedbackModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (newFeedbackText) {
                  setEvaluations(evaluations.map(ev => ev.id === evalForFeedback.id ? { ...ev, feedback: [...ev.feedback, newFeedbackText] } : ev));
                  showNotification("Feedback ajouté");
                  setIsAddFeedbackModalOpen(false);
                  setNewFeedbackText('');
                }
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nouveau Message</h3>
            <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="Votre message..." className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsNewPostModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (newPostContent) {
                  const newPost = { 
                    id: posts.length + 1, 
                    author: user.username, 
                    content: newPostContent, 
                    date: new Date().toISOString().split('T')[0], 
                    likes: 0, 
                    comments: [] 
                  };
                  setPosts([newPost, ...posts]);
                  showNotification("Message publié !");
                  setIsNewPostModalOpen(false);
                  setNewPostContent('');
                }
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Publier</button>
            </div>
          </div>
        </div>
      )}

      {/* New Issue Modal */}
      {isNewIssueModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Signaler un problème</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select value={newIssueType} onChange={(e) => setNewIssueType(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="Matériel">Matériel</option>
                  <option value="Conflit">Conflit</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea value={newIssueDesc} onChange={(e) => setNewIssueDesc(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white h-24" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsNewIssueModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (newIssueDesc) {
                  const newIssue = { 
                    id: issues.length + 1, 
                    type: newIssueType, 
                    description: newIssueDesc, 
                    status: "Nouveau", 
                    date: new Date().toISOString().split('T')[0] 
                  };
                  setIssues([...issues, newIssue]);
                  showNotification("Signalement enregistré");
                  setIsNewIssueModalOpen(false);
                  setNewIssueDesc('');
                }
              }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Signaler</button>
            </div>
          </div>
        </div>
      )}

      {/* New Disciplinary Case Modal */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nouveau Dossier Disciplinaire</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Employé</label>
                <input type="number" value={newCaseEmpId} onChange={(e) => setNewCaseEmpId(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type d'incident</label>
                <input type="text" value={newCaseType} onChange={(e) => setNewCaseType(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea value={newCaseDesc} onChange={(e) => setNewCaseDesc(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white h-24" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsNewCaseModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (newCaseEmpId && newCaseType && newCaseDesc) {
                  const newCase = { 
                    id: disciplinaryCases.length + 1, 
                    employeeId: parseInt(newCaseEmpId), 
                    type: newCaseType, 
                    description: newCaseDesc, 
                    date: new Date().toISOString().split('T')[0], 
                    status: "Nouveau", 
                    severity: "Moyenne", 
                    actions: [] 
                  };
                  setDisciplinaryCases([...disciplinaryCases, newCase]);
                  showNotification("Dossier créé");
                  setIsNewCaseModalOpen(false);
                  setNewCaseEmpId('');
                  setNewCaseDesc('');
                }
              }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Créer</button>
            </div>
          </div>
        </div>
      )}

      {/* Mediation Modal */}
      {isMediationModalOpen && caseForMediation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Planifier Médiation</h3>
            <input type="date" value={mediationDate} onChange={(e) => setMediationDate(e.target.value)} className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsMediationModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (mediationDate) {
                  const action = { date: new Date().toISOString().split('T')[0], type: "Médiation", description: `Réunion prévue le ${mediationDate}` };
                  setDisciplinaryCases(disciplinaryCases.map(c => c.id === caseForMediation.id ? { ...c, actions: [...c.actions, action] } : c));
                  showNotification("Médiation planifiée");
                  setIsMediationModalOpen(false);
                  setMediationDate('');
                }
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Planifier</button>
            </div>
          </div>
        </div>
      )}

      {/* Case Note Modal */}
      {isCaseNoteModalOpen && caseForNote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Ajouter une note</h3>
            <textarea value={caseNote} onChange={(e) => setCaseNote(e.target.value)} placeholder="Note confidentielle..." className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsCaseNoteModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (caseNote) {
                  const action = { date: new Date().toISOString().split('T')[0], type: "Note", description: caseNote };
                  setDisciplinaryCases(disciplinaryCases.map(c => c.id === caseForNote.id ? { ...c, actions: [...c.actions, action] } : c));
                  showNotification("Note ajoutée");
                  setIsCaseNoteModalOpen(false);
                  setCaseNote('');
                }
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* Sanction Modal */}
      {isSanctionModalOpen && caseForSanction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Appliquer une sanction</h3>
            <textarea value={sanctionDesc} onChange={(e) => setSanctionDesc(e.target.value)} placeholder="Détails de la sanction..." className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsSanctionModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (sanctionDesc) {
                  const action = { date: new Date().toISOString().split('T')[0], type: "Sanction", description: sanctionDesc };
                  setDisciplinaryCases(disciplinaryCases.map(c => c.id === caseForSanction.id ? { ...c, status: "Sanctionné", actions: [...c.actions, action] } : c));
                  showNotification("Sanction appliquée");
                  setIsSanctionModalOpen(false);
                  setSanctionDesc('');
                }
              }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Appliquer</button>
            </div>
          </div>
        </div>
      )}

      {/* New Benefit Modal */}
      {isNewBenefitModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nouvel Avantage</h3>
            <input type="text" value={newBenefitName} onChange={(e) => setNewBenefitName(e.target.value)} placeholder="Nom de l'avantage" className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsNewBenefitModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (newBenefitName) {
                  const newBenefit = { id: benefits.length + 1, name: newBenefitName, amount: "Variable", type: "Autre", beneficiaries: "Tous" };
                  setBenefits([...benefits, newBenefit]);
                  showNotification("Avantage ajouté");
                  setIsNewBenefitModalOpen(false);
                  setNewBenefitName('');
                }
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* Offboarding Modal */}
      {isOffboardingModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Lancer une procédure de départ</h3>
            <input type="text" value={offboardingEmpId} onChange={(e) => setOffboardingEmpId(e.target.value)} placeholder="ID de l'employé" className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsOffboardingModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                if (offboardingEmpId) {
                  showNotification("Procédure de départ initiée");
                  setIsOffboardingModalOpen(false);
                  setOffboardingEmpId('');
                }
              }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Lancer</button>
            </div>
          </div>
        </div>
      )}

      {/* Report Generation Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Génération de Rapport</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Génération du rapport {reportType === 'absences' ? "d'absences (PDF)" : reportType === 'payroll' ? "de paie (Excel)" : "d'analyse des risques (PDF)"} en cours...
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Annuler</button>
              <button onClick={() => {
                showNotification(`Rapport ${reportType === 'absences' ? "d'absences" : reportType === 'payroll' ? "de paie" : "d'analyse"} généré avec succès`);
                setIsReportModalOpen(false);
              }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5">Télécharger</button>
            </div>
          </div>
        </div>
      )}

      {/* Training Details Modal */}
      {isTrainingModalOpen && selectedTraining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{selectedTraining.title}</h3>
            <div className="space-y-3 mb-6">
              <p className="text-gray-600 dark:text-gray-300"><strong>Type:</strong> {selectedTraining.type}</p>
              <p className="text-gray-600 dark:text-gray-300"><strong>Durée:</strong> {selectedTraining.duration}</p>
              <p className="text-gray-600 dark:text-gray-300"><strong>Date:</strong> {selectedTraining.date}</p>
              <p className="text-gray-600 dark:text-gray-300"><strong>Statut:</strong> {selectedTraining.status}</p>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <p className="text-sm text-indigo-800 dark:text-indigo-300">
                  Cette formation est {selectedTraining.type.toLowerCase()}. Assurez-vous de compléter les modules pré-requis avant la date de début.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setIsTrainingModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Details Modal */}
      {isEvaluationModalOpen && selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Détails de l'évaluation</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700 dark:text-gray-300">Type:</span>
                <span className="text-gray-600 dark:text-gray-400">{selectedEvaluation.type} {selectedEvaluation.year}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700 dark:text-gray-300">Évaluateur:</span>
                <span className="text-gray-600 dark:text-gray-400">{selectedEvaluation.reviewer}</span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Objectifs fixés</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                  {selectedEvaluation.goals.map((goal, idx) => (
                    <li key={idx}>{goal}</li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-bold text-gray-800 dark:text-white mb-2">Feedback</h4>
                {selectedEvaluation.feedback.length > 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded italic text-gray-600 dark:text-gray-300">
                    {selectedEvaluation.feedback.map((fb, idx) => (
                      <p key={idx} className="mb-1">- {fb}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Aucun feedback enregistré.</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setIsEvaluationModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
