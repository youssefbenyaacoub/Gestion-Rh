import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { 
  LayoutDashboard, Users, FileText, TrendingDown, BarChart3, Wallet, 
  Sun, Moon, Search, Plus, Download, Trash2, Edit, Mail, Phone, 
  TrendingUp, PieChart, AlertCircle, Scale, Calculator, ArrowRightLeft, 
  BookOpen, Library, Coins, Percent, LineChart, Briefcase, Landmark, LogOut 
} from 'lucide-react';

function AccountingPortal({ user, onLogout, darkMode, toggleDarkMode }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ income: 0, expenses: 0, net: 0, pendingInvoices: 0 });
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  // Modal States
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Form States
  const [editingClient, setEditingClient] = useState(null);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', address: '' });
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', date: '', category: 'Matériel' });
  const [newInvoice, setNewInvoice] = useState({ client_id: '', date: '', due_date: '', items: [{ description: '', quantity: 1, unit_price: 0 }] });

  useEffect(() => {
    fetchStats();
    if (activeTab === 'clients') fetchClients();
    if (activeTab === 'invoices') { fetchInvoices(); fetchClients(); }
    if (activeTab === 'expenses') fetchExpenses();
    if (activeTab === 'revenues') fetchInvoices(); // Fetch invoices to calculate revenues
  }, [activeTab]);

  const fetchStats = () => {
    fetch('http://localhost:5000/api/accounting/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  };

  const fetchClients = () => {
    fetch('http://localhost:5000/api/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error(err));
  };

  const fetchInvoices = () => {
    fetch('http://localhost:5000/api/invoices')
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(err => console.error(err));
  };

  const fetchExpenses = () => {
    fetch('http://localhost:5000/api/expenses')
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error(err));
  };

  const handleAddClient = () => {
    const url = editingClient 
      ? `http://localhost:5000/api/clients/${editingClient.id}`
      : 'http://localhost:5000/api/clients';
    
    const method = editingClient ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    })
    .then(res => res.json())
    .then(() => {
      setIsClientModalOpen(false);
      setEditingClient(null);
      fetchClients();
      setNewClient({ name: '', email: '', phone: '', address: '' });
    });
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setNewClient({ 
      name: client.name, 
      email: client.email, 
      phone: client.phone, 
      address: client.address 
    });
    setIsClientModalOpen(true);
  };

  const handleAddExpense = () => {
    fetch('http://localhost:5000/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExpense)
    })
    .then(res => res.json())
    .then(() => {
      setIsExpenseModalOpen(false);
      fetchExpenses();
      fetchStats();
      setNewExpense({ description: '', amount: '', date: '', category: 'Matériel' });
    });
  };

  const handleAddInvoice = () => {
    fetch('http://localhost:5000/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInvoice)
    })
    .then(res => res.json())
    .then(() => {
      setIsInvoiceModalOpen(false);
      fetchInvoices();
      fetchStats();
      setNewInvoice({ client_id: '', date: '', due_date: '', items: [{ description: '', quantity: 1, unit_price: 0 }] });
    });
  };

  const updateInvoiceStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/invoices/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    .then(res => res.json())
    .then(() => {
      fetchInvoices();
      fetchStats();
    })
    .catch(err => console.error(err));
  };

  const generateInvoicePDF = (invoice) => {
    fetch(`http://localhost:5000/api/invoices/${invoice.id}`)
      .then(res => res.json())
      .then(data => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        
        // --- 1. Header & Company Info ---
        // Logo Placeholder
        doc.setFillColor(79, 70, 229); // Indigo 600
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("KYCE", 20, 20);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Audit & Consulting", 20, 28);

        // Company Details (Right side of header)
        doc.setFontSize(9);
        doc.text("Les Berges du Lac 1, Tunis", pageWidth - 20, 15, { align: "right" });
        doc.text("Tél: +216 71 123 456 | Email: contact@kyce.tn", pageWidth - 20, 20, { align: "right" });
        doc.text("MF: 1234567/A/M/000 | RC: B123452020", pageWidth - 20, 25, { align: "right" });

        // --- 2. Invoice Info & Client Info ---
        doc.setTextColor(0, 0, 0);
        const topMargin = 55;
        
        // Invoice Details Box
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, topMargin, 80, 35, 3, 3, 'FD');
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("DÉTAILS FACTURE", 25, topMargin + 8);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`Numéro: INV-${invoice.id.toString().padStart(4, '0')}`, 25, topMargin + 16);
        doc.text(`Date d'émission: ${new Date(invoice.date).toLocaleDateString('fr-FR')}`, 25, topMargin + 22);
        doc.text(`Date d'échéance: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('fr-FR') : '-'}`, 25, topMargin + 28);
        
        // Client Details Box
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(110, topMargin, 80, 35, 3, 3, 'FD');
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("FACTURÉ À", 115, topMargin + 8);
        
        doc.setFontSize(10);
        doc.text(data.client_name || "Client", 115, topMargin + 16);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(data.client_address || "Adresse non renseignée", 115, topMargin + 22);
        doc.text(data.client_email || "", 115, topMargin + 28);
        doc.text(data.client_phone || "", 115, topMargin + 34);

        // --- 3. Items Table ---
        const tableColumn = ["Description", "Qté", "Prix Unit. HT", "TVA", "Total HT"];
        const tableRows = [];

        data.items.forEach(item => {
          const unitPrice = Number(item.unit_price);
          const quantity = Number(item.quantity);
          const totalHT = unitPrice * quantity;
          
          const itemData = [
            item.description,
            quantity,
            `${unitPrice.toFixed(2)} DT`,
            "19%",
            `${totalHT.toFixed(2)} DT`
          ];
          tableRows.push(itemData);
        });

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 105,
          theme: 'grid',
          headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
          styles: { fontSize: 9, cellPadding: 3 },
          columnStyles: {
            0: { cellWidth: 'auto' }, // Description
            1: { cellWidth: 20, halign: 'center' }, // Qty
            2: { cellWidth: 30, halign: 'right' }, // Price
            3: { cellWidth: 20, halign: 'center' }, // TVA
            4: { cellWidth: 30, halign: 'right' } // Total
          }
        });
        
        // --- 4. Totals ---
        const finalY = doc.lastAutoTable.finalY + 10;
        const totalHT = Number(invoice.total) - Number(invoice.tax);
        const totalTVA = Number(invoice.tax);
        
        doc.setFontSize(10);
        
        // Draw Totals Box
        const totalsX = 130;
        doc.text("Total HT:", totalsX, finalY);
        doc.text(`${totalHT.toFixed(2)} DT`, pageWidth - 20, finalY, { align: "right" });
        
        doc.text("Total TVA (19%):", totalsX, finalY + 7);
        doc.text(`${totalTVA.toFixed(2)} DT`, pageWidth - 20, finalY + 7, { align: "right" });
        
        doc.text("Timbre Fiscal:", totalsX, finalY + 14);
        doc.text("1.000 DT", pageWidth - 20, finalY + 14, { align: "right" });
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(79, 70, 229);
        doc.text("Net à payer:", totalsX, finalY + 24);
        doc.text(`${(Number(invoice.total) + 1).toFixed(2)} DT`, pageWidth - 20, finalY + 24, { align: "right" });
        
        // --- 5. Footer & Legal ---
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        
        const footerY = 270;
        doc.line(20, footerY, pageWidth - 20, footerY);
        doc.text("KYCE SARL - MF: 1234567/A/M/000 - RC: B123452020", pageWidth / 2, footerY + 5, { align: "center" });
        doc.text("RIB: 12 345 678 9012345678 90 - Banque de Tunisie", pageWidth / 2, footerY + 10, { align: "center" });
        doc.text("Merci de votre confiance !", pageWidth / 2, footerY + 15, { align: "center" });

        doc.save(`Facture_${invoice.id}.pdf`);
      });
  };

  const generateFinancialReport = (type) => {
    fetch('http://localhost:5000/api/accounting/reports/data')
      .then(res => res.json())
      .then(data => {
        const doc = new jsPDF();
        const now = new Date();
        const title = getReportTitle(type);
        
        // Header
        doc.setFillColor(79, 70, 229);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("KYCE", 20, 20);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Audit & Consulting", 20, 28);
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(title, 20, 55);
        doc.setFontSize(10);
        doc.text(`Généré le: ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}`, 20, 62);

        let startY = 70;

        // --- Report Logic Switch ---
        if (type === 'bilan') {
            // 1. Bilan Comptable (Simplified)
            const totalAssets = data.invoices.filter(i => i.status !== 'Payé').reduce((acc, i) => acc + Number(i.total), 0) + 50000; // Mock Cash
            const totalLiabilities = data.expenses.reduce((acc, e) => acc + Number(e.amount), 0); // Simplified
            
            autoTable(doc, {
                startY,
                head: [['Actifs', 'Montant', 'Passifs', 'Montant']],
                body: [
                    ['Caisse & Banque', '50,000.00 DT', 'Dettes Fournisseurs', '0.00 DT'],
                    ['Créances Clients', `${totalAssets.toFixed(2)} DT`, 'Capital Social', '10,000.00 DT'],
                    ['Matériel', '15,000.00 DT', 'Résultat Net', `${(totalAssets - totalLiabilities).toFixed(2)} DT`],
                    ['Total Actifs', `${(totalAssets + 65000).toFixed(2)} DT`, 'Total Passifs', `${(totalAssets + 65000).toFixed(2)} DT`]
                ]
            });
        } else if (type === 'resultat') {
            // 2. Compte de Résultat
            const ca = data.invoices.reduce((acc, i) => acc + Number(i.total), 0);
            const charges = data.expenses.reduce((acc, e) => acc + Number(e.amount), 0);
            const salaires = data.payslips.reduce((acc, p) => acc + Number(p.gross_salary), 0);
            const resultat = ca - charges - salaires;

            autoTable(doc, {
                startY,
                head: [['Poste', 'Montant']],
                body: [
                    ['Chiffre d\'Affaires (HT)', `${ca.toFixed(2)} DT`],
                    ['Charges d\'Exploitation', `-${charges.toFixed(2)} DT`],
                    ['Salaires & Charges', `-${salaires.toFixed(2)} DT`],
                    ['RÉSULTAT NET', `${resultat.toFixed(2)} DT`]
                ],
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229] }
            });
        } else if (type === 'factures') {
            // 7. Rapport des Factures
            autoTable(doc, {
                startY,
                head: [['Date', 'Client', 'Statut', 'Total TTC']],
                body: data.invoices.map(i => [
                    new Date(i.date).toLocaleDateString(),
                    i.client_name,
                    i.status,
                    `${Number(i.total).toFixed(2)} DT`
                ])
            });
        } else if (type === 'clients') {
            // 13. Rapport Clients
            const clientStats = {};
            data.invoices.forEach(inv => {
                if (!clientStats[inv.client_name]) clientStats[inv.client_name] = 0;
                clientStats[inv.client_name] += Number(inv.total);
            });
            
            const body = Object.keys(clientStats).map(name => [name, `${clientStats[name].toFixed(2)} DT`]);
            
            autoTable(doc, {
                startY,
                head: [['Client', 'Chiffre d\'Affaires Total']],
                body: body
            });
        } else if (type === 'tva') {
            // 10. Rapport TVA
            const tvaCollectee = data.invoices.reduce((acc, i) => acc + Number(i.tax), 0);
            const tvaDeductible = data.expenses.reduce((acc, e) => acc + (Number(e.amount) * 0.19), 0); // Assuming 19% on expenses
            
            autoTable(doc, {
                startY,
                head: [['Désignation', 'Montant']],
                body: [
                    ['TVA Collectée (Ventes)', `${tvaCollectee.toFixed(2)} DT`],
                    ['TVA Déductible (Achats - Est.)', `${tvaDeductible.toFixed(2)} DT`],
                    ['TVA À PAYER', `${(tvaCollectee - tvaDeductible).toFixed(2)} DT`]
                ]
            });
        } else if (type === 'cashflow') {
            // 3. Flux de Trésorerie
            const operationalIn = data.invoices.filter(i => i.status === 'Payé').reduce((acc, i) => acc + Number(i.total), 0);
            const operationalOut = data.expenses.reduce((acc, e) => acc + Number(e.amount), 0);
            const netOperational = operationalIn - operationalOut;
            
            autoTable(doc, {
                startY,
                head: [['Catégorie', 'Entrées', 'Sorties', 'Net']],
                body: [
                    ['Flux Opérationnels', `+${operationalIn.toFixed(2)} DT`, `-${operationalOut.toFixed(2)} DT`, `${netOperational.toFixed(2)} DT`],
                    ['Flux d\'Investissement', '0.00 DT', '-5,000.00 DT', '-5,000.00 DT'],
                    ['Flux de Financement', '10,000.00 DT', '0.00 DT', '+10,000.00 DT'],
                    ['FLUX NET TOTAL', '', '', `${(netOperational + 5000).toFixed(2)} DT`]
                ]
            });
        } else if (type === 'journal') {
            // 4. Journal Comptable
            const journalEntries = [
                ...data.invoices.map(i => ({ date: i.date, desc: `Facture Client ${i.client_name}`, debit: i.total, credit: 0, ref: `INV-${i.id}` })),
                ...data.expenses.map(e => ({ date: e.date, desc: `Dépense: ${e.description}`, debit: 0, credit: e.amount, ref: `EXP-${e.id}` }))
            ].sort((a, b) => new Date(a.date) - new Date(b.date));

            autoTable(doc, {
                startY,
                head: [['Date', 'Réf', 'Description', 'Débit', 'Crédit']],
                body: journalEntries.map(e => [
                    new Date(e.date).toLocaleDateString(),
                    e.ref,
                    e.desc,
                    e.debit ? `${Number(e.debit).toFixed(2)}` : '',
                    e.credit ? `${Number(e.credit).toFixed(2)}` : ''
                ])
            });
        } else if (type === 'grandlivre') {
            // 5. Grand Livre
            const accounts = { 'Ventes': [], 'Achats': [], 'Banque': [] };
            data.invoices.forEach(i => accounts['Ventes'].push({ date: i.date, desc: `Facture ${i.id}`, amount: i.total }));
            data.expenses.forEach(e => accounts['Achats'].push({ date: e.date, desc: e.description, amount: e.amount }));
            
            let currentY = startY;
            Object.keys(accounts).forEach(acc => {
                if (accounts[acc].length > 0) {
                    doc.text(`Compte: ${acc}`, 14, currentY);
                    autoTable(doc, {
                        startY: currentY + 5,
                        head: [['Date', 'Libellé', 'Montant']],
                        body: accounts[acc].map(t => [new Date(t.date).toLocaleDateString(), t.desc, `${Number(t.amount).toFixed(2)} DT`]),
                        theme: 'striped'
                    });
                    currentY = doc.lastAutoTable.finalY + 10;
                }
            });
        } else if (type === 'balance') {
            // 6. Balance Comptable
            const totalVentes = data.invoices.reduce((acc, i) => acc + Number(i.total), 0);
            const totalAchats = data.expenses.reduce((acc, e) => acc + Number(e.amount), 0);
            
            autoTable(doc, {
                startY,
                head: [['Compte', 'Débit', 'Crédit', 'Solde']],
                body: [
                    ['707 - Ventes Marchandises', '0.00', totalVentes.toFixed(2), `(C) ${totalVentes.toFixed(2)}`],
                    ['607 - Achats Marchandises', totalAchats.toFixed(2), '0.00', `(D) ${totalAchats.toFixed(2)}`],
                    ['512 - Banque', (totalVentes - totalAchats).toFixed(2), '0.00', `(D) ${(totalVentes - totalAchats).toFixed(2)}`]
                ]
            });
        } else if (type === 'depenses') {
            // 8. Rapport Dépenses
            autoTable(doc, {
                startY,
                head: [['Date', 'Catégorie', 'Description', 'Montant']],
                body: data.expenses.map(e => [
                    new Date(e.date).toLocaleDateString(),
                    e.category,
                    e.description,
                    `${Number(e.amount).toFixed(2)} DT`
                ])
            });
        } else if (type === 'recettes') {
            // 9. Rapport Recettes
            const paidInvoices = data.invoices.filter(i => i.status === 'Payé');
            autoTable(doc, {
                startY,
                head: [['Date', 'Client', 'Réf', 'Montant']],
                body: paidInvoices.map(i => [
                    new Date(i.date).toLocaleDateString(),
                    i.client_name,
                    `INV-${i.id}`,
                    `${Number(i.total).toFixed(2)} DT`
                ])
            });
            doc.text(`Total Recettes: ${paidInvoices.reduce((acc, i) => acc + Number(i.total), 0).toFixed(2)} DT`, 14, doc.lastAutoTable.finalY + 10);
        } else if (type === 'salaires') {
            // 11. Masse Salariale
            const totalGross = data.payslips.reduce((acc, p) => acc + Number(p.gross_salary), 0);
            const totalNet = data.payslips.reduce((acc, p) => acc + Number(p.net_salary), 0);
            
            autoTable(doc, {
                startY,
                head: [['Mois', 'Employé', 'Salaire Brut', 'Salaire Net']],
                body: data.payslips.map(p => [
                    `${p.month}/${p.year}`,
                    `ID: ${p.user_id}`,
                    `${Number(p.gross_salary).toFixed(2)} DT`,
                    `${Number(p.net_salary).toFixed(2)} DT`
                ])
            });
            doc.text(`Total Masse Salariale (Brut): ${totalGross.toFixed(2)} DT`, 14, doc.lastAutoTable.finalY + 10);
            doc.text(`Total Net à Payer: ${totalNet.toFixed(2)} DT`, 14, doc.lastAutoTable.finalY + 16);
        } else if (type === 'prevision') {
            // 12. Trésorerie Prévisionnelle
            const dueInvoices = data.invoices.filter(i => i.status !== 'Payé').reduce((acc, i) => acc + Number(i.total), 0);
            const estimatedExpenses = 5000; // Mock
            
            autoTable(doc, {
                startY,
                head: [['Période', 'Entrées Prévues', 'Sorties Prévues', 'Solde Prévu']],
                body: [
                    ['Mois Prochain', `${dueInvoices.toFixed(2)} DT`, `${estimatedExpenses.toFixed(2)} DT`, `${(dueInvoices - estimatedExpenses).toFixed(2)} DT`],
                    ['Trimestre Prochain', `${(dueInvoices * 2.5).toFixed(2)} DT`, `${(estimatedExpenses * 3).toFixed(2)} DT`, `${(dueInvoices * 2.5 - estimatedExpenses * 3).toFixed(2)} DT`]
                ]
            });
        } else if (type === 'analytique') {
            // 14. Rapport Analytique
            const categories = {};
            data.expenses.forEach(e => {
                if (!categories[e.category]) categories[e.category] = 0;
                categories[e.category] += Number(e.amount);
            });
            
            autoTable(doc, {
                startY,
                head: [['Centre de Coût', 'Montant Total', '% du Total']],
                body: Object.keys(categories).map(cat => {
                    const total = data.expenses.reduce((acc, e) => acc + Number(e.amount), 0);
                    return [cat, `${categories[cat].toFixed(2)} DT`, `${((categories[cat] / total) * 100).toFixed(1)}%`];
                })
            });
        } else if (type === 'banque') {
            // 15. Rapport Banque
            const soldeComptable = 50000 + data.invoices.filter(i => i.status === 'Payé').reduce((acc, i) => acc + Number(i.total), 0) - data.expenses.reduce((acc, e) => acc + Number(e.amount), 0);
            const soldeBancaire = soldeComptable - 150; // Mock difference
            
            autoTable(doc, {
                startY,
                head: [['Libellé', 'Montant']],
                body: [
                    ['Solde Comptable (Théorique)', `${soldeComptable.toFixed(2)} DT`],
                    ['Solde Relevé Bancaire', `${soldeBancaire.toFixed(2)} DT`],
                    ['Écart (Frais bancaires non saisis)', '150.00 DT']
                ]
            });
        } else {
            doc.text("Rapport en cours de développement...", 20, 80);
        }

        doc.save(`Rapport_${type}_${now.getTime()}.pdf`);
      });
  };

  const getReportTitle = (type) => {
      const titles = {
          'bilan': 'Bilan Comptable',
          'resultat': 'Compte de Résultat',
          'cashflow': 'Flux de Trésorerie',
          'journal': 'Journal Comptable',
          'grandlivre': 'Grand Livre',
          'balance': 'Balance Comptable',
          'factures': 'Rapport des Factures',
          'depenses': 'Rapport des Dépenses',
          'recettes': 'Rapport des Recettes',
          'tva': 'Déclaration TVA',
          'salaires': 'Masse Salariale',
          'prevision': 'Trésorerie Prévisionnelle',
          'clients': 'Analyse Clients',
          'analytique': 'Comptabilité Analytique',
          'banque': 'Rapprochement Bancaire'
      };
      return titles[type] || 'Rapport Financier';
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 transition-all duration-300 z-30 ${darkMode ? 'bg-slate-800 border-r border-slate-700' : 'bg-white border-r border-slate-200'} flex flex-col`}>
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/30">
            C
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Compta<span className="text-indigo-600">Pro</span></h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Enterprise Edition</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={20} /> },
            { id: 'revenues', label: 'Recettes', icon: <Wallet size={20} /> },
            { id: 'clients', label: 'Clients', icon: <Users size={20} /> },
            { id: 'invoices', label: 'Factures', icon: <FileText size={20} /> },
            { id: 'expenses', label: 'Dépenses', icon: <TrendingDown size={20} /> },
            { id: 'reports', label: 'Rapports', icon: <BarChart3 size={20} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 font-medium text-sm group ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-800' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className={`transition-transform group-hover:scale-110 ${activeTab === item.id ? 'scale-110' : ''}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4 mb-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.username}</p>
              <p className="text-xs text-slate-500 truncate">Comptable Senior</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:text-red-400 rounded-xl transition-all text-sm font-semibold">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-10 max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold capitalize text-slate-800 dark:text-white tracking-tight">{activeTab === 'dashboard' ? 'Vue d\'ensemble' : activeTab}</h2>
            <p className="text-slate-500 mt-1">Gérez votre activité financière en temps réel</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <button onClick={toggleDarkMode} className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all text-xl text-slate-600 dark:text-slate-300">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {[
              { label: 'Revenus (Mois)', value: stats.income, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: <TrendingUp size={24} className="text-emerald-600 dark:text-emerald-400" /> },
              { label: 'Dépenses', value: stats.expenses, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20', icon: <TrendingDown size={24} className="text-rose-600 dark:text-rose-400" /> },
              { label: 'Bénéfice Net', value: stats.net, color: stats.net >= 0 ? 'text-indigo-600' : 'text-amber-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: <PieChart size={24} className={stats.net >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'} /> },
              { label: 'Factures en retard', value: stats.pendingInvoices, isCount: true, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: <AlertCircle size={24} className="text-amber-600 dark:text-amber-400" /> },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>{stat.icon}</div>
                  {stat.isCount && <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Action requise</span>}
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className={`text-3xl font-bold ${stat.color}`}>
                  {stat.isCount ? stat.value : `${stat.value.toFixed(2)} DT`}
                </h3>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'revenues' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                 <p className="text-slate-500 text-sm font-medium mb-1">Total Recettes</p>
                 <h3 className="text-3xl font-bold text-emerald-600">{stats.income.toFixed(2)} DT</h3>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Journal des Recettes</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Client</th>
                    <th className="px-8 py-5">Référence</th>
                    <th className="px-8 py-5 text-right">Montant Encaissé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {invoices.filter(inv => inv.status === 'Payé').map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-8 py-5 text-slate-500">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="px-8 py-5 font-medium text-slate-800 dark:text-white">{inv.client_name}</td>
                      <td className="px-8 py-5 font-mono text-sm text-slate-500">INV-{inv.id.toString().padStart(4, '0')}</td>
                      <td className="px-8 py-5 font-bold text-emerald-600 text-right">+{Number(inv.total).toFixed(2)} DT</td>
                    </tr>
                  ))}
                  {invoices.filter(inv => inv.status === 'Payé').length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-8 py-10 text-center text-slate-500">Aucune recette enregistrée</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div className="relative">
                <input type="text" placeholder="Rechercher un client..." className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none w-64" />
                <span className="absolute left-3 top-2.5 text-slate-400"><Search size={18} /></span>
              </div>
              <button onClick={() => {
                setEditingClient(null);
                setNewClient({ name: '', email: '', phone: '', address: '' });
                setIsClientModalOpen(true);
              }} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none font-medium flex items-center gap-2">
                <Plus size={18} /> Nouveau Client
              </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-5">Nom de l'entreprise</th>
                    <th className="px-8 py-5">Contact</th>
                    <th className="px-8 py-5">Localisation</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {clients.map(client => (
                    <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-800 dark:text-white">{client.name}</div>
                        <div className="text-xs text-slate-500">ID: #{client.id}</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2"><Mail size={14} /> {client.email}</span>
                          <span className="text-sm text-slate-500 flex items-center gap-2"><Phone size={14} /> {client.phone}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-slate-500">{client.address}</td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => handleEditClient(client)} className="text-slate-400 hover:text-indigo-600 transition-colors"><Edit size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-end">
              <button onClick={() => setIsInvoiceModalOpen(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none font-medium flex items-center gap-2">
                <Plus size={18} /> Nouvelle Facture
              </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-5">Référence</th>
                    <th className="px-8 py-5">Client</th>
                    <th className="px-8 py-5">Date d'émission</th>
                    <th className="px-8 py-5">Montant TTC</th>
                    <th className="px-8 py-5">État</th>
                    <th className="px-8 py-5 text-right">Document</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-8 py-5 font-mono text-sm text-slate-500">INV-{inv.id.toString().padStart(4, '0')}</td>
                      <td className="px-8 py-5 font-medium text-slate-800 dark:text-white">{inv.client_name}</td>
                      <td className="px-8 py-5 text-slate-500">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="px-8 py-5 font-bold text-slate-800 dark:text-white">{Number(inv.total).toFixed(2)} DT</td>
                      <td className="px-8 py-5">
                        <select 
                          value={inv.status} 
                          onChange={(e) => updateInvoiceStatus(inv.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border outline-none cursor-pointer appearance-none ${
                            inv.status === 'Payé' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                            inv.status === 'En retard' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                            'bg-amber-100 text-amber-700 border-amber-200'
                          }`}
                        >
                          <option value="Non payé">Non payé</option>
                          <option value="Payé">Payé</option>
                          <option value="En retard">En retard</option>
                        </select>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => generateInvoicePDF(inv)} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-end gap-1">
                          <Download size={16} /> Télécharger
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-end">
              <button onClick={() => setIsExpenseModalOpen(true)} className="px-6 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-200 dark:shadow-none font-medium flex items-center gap-2">
                <Plus size={18} /> Nouvelle Dépense
              </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Description</th>
                    <th className="px-8 py-5">Catégorie</th>
                    <th className="px-8 py-5 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-8 py-5 text-slate-500">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="px-8 py-5 font-medium text-slate-800 dark:text-white">{exp.description}</td>
                      <td className="px-8 py-5">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-bold text-rose-600 text-right">-{Number(exp.amount).toFixed(2)} DT</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { id: 'bilan', label: 'Bilan Comptable', icon: <Scale size={24} className="text-indigo-600 dark:text-indigo-400" />, desc: 'Actifs, Passifs & Capitaux' },
                { id: 'resultat', label: 'Compte de Résultat', icon: <Calculator size={24} className="text-emerald-600 dark:text-emerald-400" />, desc: 'Rentabilité & Performance' },
                { id: 'cashflow', label: 'Flux de Trésorerie', icon: <ArrowRightLeft size={24} className="text-blue-600 dark:text-blue-400" />, desc: 'Entrées & Sorties Cash' },
                { id: 'journal', label: 'Journal Comptable', icon: <BookOpen size={24} className="text-amber-600 dark:text-amber-400" />, desc: 'Toutes les écritures' },
                { id: 'grandlivre', label: 'Grand Livre', icon: <Library size={24} className="text-purple-600 dark:text-purple-400" />, desc: 'Classement par compte' },
                { id: 'balance', label: 'Balance Comptable', icon: <Scale size={24} className="text-cyan-600 dark:text-cyan-400" />, desc: 'Synthèse des comptes' },
                { id: 'factures', label: 'Rapport Factures', icon: <FileText size={24} className="text-rose-600 dark:text-rose-400" />, desc: 'Suivi facturation' },
                { id: 'depenses', label: 'Rapport Dépenses', icon: <TrendingDown size={24} className="text-red-600 dark:text-red-400" />, desc: 'Analyse des coûts' },
                { id: 'recettes', label: 'Rapport Recettes', icon: <Coins size={24} className="text-green-600 dark:text-green-400" />, desc: 'Suivi des encaissements' },
                { id: 'tva', label: 'Déclaration TVA', icon: <Percent size={24} className="text-orange-600 dark:text-orange-400" />, desc: 'TVA Collectée & Déductible' },
                { id: 'salaires', label: 'Masse Salariale', icon: <Users size={24} className="text-pink-600 dark:text-pink-400" />, desc: 'Coûts RH & Social' },
                { id: 'prevision', label: 'Trésorerie Prévisionnelle', icon: <LineChart size={24} className="text-teal-600 dark:text-teal-400" />, desc: 'Projections futures' },
                { id: 'clients', label: 'Rapport Clients', icon: <Briefcase size={24} className="text-indigo-600 dark:text-indigo-400" />, desc: 'Top clients & Retards' },
                { id: 'analytique', label: 'Rapport Analytique', icon: <PieChart size={24} className="text-violet-600 dark:text-violet-400" />, desc: 'Rentabilité par projet' },
                { id: 'banque', label: 'Rapport Banque', icon: <Landmark size={24} className="text-slate-600 dark:text-slate-400" />, desc: 'Rapprochement bancaire' },
              ].map(report => (
                <div key={report.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center hover:shadow-md transition-all group cursor-pointer" onClick={() => generateFinancialReport(report.id)}>
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {report.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-1">{report.label}</h3>
                  <p className="text-xs text-slate-500 mb-4">{report.desc}</p>
                  <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center gap-2 mx-auto">
                    <Download size={16} /> Générer PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals - Improved Design */}
      {(isClientModalOpen || isExpenseModalOpen || isInvoiceModalOpen) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          {/* Client Modal */}
          {isClientModalOpen && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-700 transform transition-all scale-100">
              <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">{editingClient ? 'Modifier Client' : 'Nouveau Client'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom de l'entreprise</label>
                  <input type="text" className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input type="email" className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Téléphone</label>
                  <input type="text" className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adresse</label>
                  <input type="text" className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} />
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button onClick={() => setIsClientModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors">Annuler</button>
                  <button onClick={handleAddClient} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 dark:shadow-none transition-all">Enregistrer</button>
                </div>
              </div>
            </div>
          )}

          {/* Expense Modal */}
          {isExpenseModalOpen && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-700">
              <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Nouvelle Dépense</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <input type="text" className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-rose-500 outline-none transition-all" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Montant</label>
                    <input type="number" className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-rose-500 outline-none transition-all" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                    <input type="date" className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-rose-500 outline-none transition-all" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Catégorie</label>
                  <select className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-rose-500 outline-none transition-all" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                    <option value="Matériel">Matériel</option>
                    <option value="Logiciel">Logiciel</option>
                    <option value="Loyer">Loyer</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button onClick={() => setIsExpenseModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors">Annuler</button>
                  <button onClick={handleAddExpense} className="px-5 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 font-medium shadow-lg shadow-rose-200 dark:shadow-none transition-all">Enregistrer</button>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Modal */}
          {isInvoiceModalOpen && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 w-full max-w-3xl shadow-2xl border border-slate-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Nouvelle Facture</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={newInvoice.client_id} onChange={e => setNewInvoice({...newInvoice, client_id: e.target.value})}>
                      <option value="">Sélectionner un client</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date d'émission</label>
                    <input type="date" className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={newInvoice.date} onChange={e => setNewInvoice({...newInvoice, date: e.target.value})} />
                  </div>
                </div>
                
                <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">Services / Produits</h4>
                    <button onClick={() => setNewInvoice({...newInvoice, items: [...newInvoice.items, { description: '', quantity: 1, unit_price: 0 }]})} className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                      + Ajouter une ligne
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {newInvoice.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="flex-1">
                          <input type="text" placeholder="Description" className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" value={item.description} onChange={e => {
                            const newItems = [...newInvoice.items];
                            newItems[idx].description = e.target.value;
                            setNewInvoice({...newInvoice, items: newItems});
                          }} />
                        </div>
                        <div className="w-24">
                          <input type="number" placeholder="Qté" className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" value={item.quantity} onChange={e => {
                            const newItems = [...newInvoice.items];
                            newItems[idx].quantity = parseInt(e.target.value);
                            setNewInvoice({...newInvoice, items: newItems});
                          }} />
                        </div>
                        <div className="w-32">
                          <input type="number" placeholder="Prix" className="w-full p-3 border border-slate-200 rounded-xl dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none" value={item.unit_price} onChange={e => {
                            const newItems = [...newInvoice.items];
                            newItems[idx].unit_price = parseFloat(e.target.value);
                            setNewInvoice({...newInvoice, items: newItems});
                          }} />
                        </div>
                        <div className="w-10 pt-3 text-center text-slate-400 hover:text-red-500 cursor-pointer">
                          <Trash2 size={18} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <button onClick={() => setIsInvoiceModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors">Annuler</button>
                  <button onClick={handleAddInvoice} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 dark:shadow-none transition-all">Créer Facture</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AccountingPortal;
