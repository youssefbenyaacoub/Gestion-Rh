import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

// Simple SVG Icons
const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>,
  Plane: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>,
  Document: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
  Clock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  Academic: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>,
  Target: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>,
  Ticket: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>,
  Newspaper: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>,
  Sun: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
  Moon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 24.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>,
  Construction: () => <svg className="w-16 h-16 text-brand-light mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
};

function EmployeePortal({ 
  user, 
  onLogout, 
  darkMode, 
  toggleDarkMode,
  leaveRequests,
  setLeaveRequests,
  myPayslips,
  issues,
  setIssues,
  clockIns,
  setClockIns,
  onClockIn,
  onClockOut,
  trainings,
  setTrainings,
  evaluations,
  posts,
  setPosts,
  notifications,
  markAsSeen,
  resources
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [selectedTrainingContent, setSelectedTrainingContent] = useState(null);

  const handleEnroll = (trainingId) => {
    if (window.confirm("Voulez-vous vous inscrire à cette formation ?")) {
      setTrainings(prev => prev.map(t => 
        t.id === trainingId 
          ? { ...t, participants: [...t.participants, user?.id || 1] } 
          : t
      ));
      alert("Inscription réussie !");
      setIsCatalogOpen(false);
    }
  };

  // Local states for modals/interactions
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = useState(false);
  const [newIssueType, setNewIssueType] = useState('Matériel');
  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [visibleComments, setVisibleComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Derived state
  const todayClockIn = clockIns.find(c => c.employeeId === (user?.id || 1) && c.date === new Date().toISOString().split('T')[0]);



  const handleLikePost = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const userId = user?.id || 1;
        const likedBy = p.likedBy || [];
        const hasLiked = likedBy.includes(userId);
        
        return {
          ...p,
          likes: hasLiked ? p.likes - 1 : p.likes + 1,
          likedBy: hasLiked ? likedBy.filter(id => id !== userId) : [...likedBy, userId]
        };
      }
      return p;
    }));
  };

  const handleCommentSubmit = (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    const newComment = {
      author: user?.username || 'Moi',
      text: commentText,
      date: new Date().toISOString()
    };

    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, comments: [...(p.comments || []), newComment] } 
        : p
    ));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const toggleComments = (postId) => {
    setVisibleComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const navItems = [
    { id: 'dashboard', label: 'Accueil', icon: <Icons.Home /> },
    { id: 'leave_requests', label: 'Congés', icon: <Icons.Plane />, notification: notifications.leave },
    { id: 'documents', label: 'Documents', icon: <Icons.Document /> },
    { id: 'attendance', label: 'Pointage', icon: <Icons.Clock /> },
    { id: 'training', label: 'Formation', icon: <Icons.Academic /> },
    { id: 'tickets', label: 'Support', icon: <Icons.Ticket /> },
    { id: 'news', label: 'Actualités', icon: <Icons.Newspaper /> },
    { id: 'settings', label: 'Paramètres', icon: <Icons.Settings /> },
  ];



  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-brand-dark to-brand-primary rounded-xl p-8 text-white shadow-lg">
              <h2 className="text-3xl font-bold mb-2">Bonjour, {user.username}</h2>
              <p className="opacity-90 font-light">Bienvenue sur votre espace collaborateur.</p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg flex items-center gap-4 border border-white/20">
                  <div className="p-2 bg-white/20 rounded-lg"><Icons.Clock /></div>
                  <div>
                    <p className="text-xs opacity-75 uppercase tracking-wider">Date</p>
                    <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg flex items-center gap-4 border border-white/20">
                  <div className="p-2 bg-white/20 rounded-lg"><Icons.Target /></div>
                  <div>
                    <p className="text-xs opacity-75 uppercase tracking-wider">Statut</p>
                    <p className="font-semibold">{todayClockIn ? (todayClockIn.out ? 'Terminé' : 'En poste') : 'Non pointé'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-brand-light transition-all duration-300 ease-in-out cursor-pointer group" 
                onClick={() => setActiveTab('leave_requests')}
              >
                <div className="w-12 h-12 bg-brand-bg dark:bg-gray-700 text-brand-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                  <Icons.Plane />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-1 group-hover:text-brand-primary transition-colors">Demander un congé</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Planifiez vos absences</p>
              </div>
              
              <div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-brand-light transition-all duration-300 ease-in-out cursor-pointer group" 
                onClick={() => setActiveTab('tickets')}
              >
                <div className="w-12 h-12 bg-brand-bg dark:bg-gray-700 text-brand-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                  <Icons.Ticket />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-1 group-hover:text-brand-primary transition-colors">Support IT & RH</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Signaler un incident</p>
              </div>
              
              <div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-brand-light transition-all duration-300 ease-in-out cursor-pointer group" 
                onClick={() => setActiveTab('documents')}
              >
                <div className="w-12 h-12 bg-brand-bg dark:bg-gray-700 text-brand-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                  <Icons.Document />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-1 group-hover:text-brand-primary transition-colors">Mes Documents</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Accès rapide aux fiches de paie</p>
              </div>
            </div>

            {/* News Feed Preview */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Actualités Récentes</h3>
                <button onClick={() => setActiveTab('news')} className="text-brand-primary hover:text-brand-dark text-sm font-medium transition-colors">Voir tout</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.slice(0, 2).map(post => (
                  <div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-brand-light transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-brand-bg dark:bg-gray-700 flex items-center justify-center text-brand-dark font-bold text-xs">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800 dark:text-white">{post.author}</p>
                        <p className="text-xs text-gray-500">{post.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Pointage du jour</h3>
              
              <div className="flex justify-center items-center gap-12 mb-10">
                <div className="text-center">
                  <div className="text-5xl font-black text-brand-dark dark:text-brand-light mb-2 tracking-tight">{todayClockIn?.in || '--:--'}</div>
                  <p className="text-gray-400 uppercase text-xs font-bold tracking-wider">Arrivée</p>
                </div>
                <div className="h-16 w-px bg-gray-200 dark:bg-gray-700"></div>
                <div className="text-center">
                  <div className="text-5xl font-black text-gray-400 dark:text-gray-600 mb-2 tracking-tight">{todayClockIn?.out || '--:--'}</div>
                  <p className="text-gray-400 uppercase text-xs font-bold tracking-wider">Départ</p>
                </div>
              </div>

              {!todayClockIn ? (
                <button onClick={onClockIn} className="w-full py-4 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] text-lg">
                  Enregistrer mon arrivée
                </button>
              ) : !todayClockIn.out ? (
                <button onClick={onClockOut} className="w-full py-4 bg-brand-dark hover:bg-brand-medium text-white font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] text-lg">
                  Enregistrer mon départ
                </button>
              ) : (
                <div className="p-4 bg-brand-bg dark:bg-gray-700 rounded-xl text-brand-dark dark:text-brand-light font-medium border border-brand-light/20">
                  Journée terminée. À demain !
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-gray-800 dark:text-white mb-4">Historique de la semaine</h4>
              <div className="space-y-3">
                {clockIns.filter(c => c.employeeId === (user?.id || 1)).slice(0, 5).map(clock => (
                  <div key={clock.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="font-medium text-gray-700 dark:text-gray-200">{clock.date}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-brand-dark font-bold bg-brand-bg px-3 py-1 rounded-md">{clock.in}</span>
                      <span className="text-gray-500 font-bold bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-md">{clock.out || '--:--'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Mes Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payslips */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="p-2 bg-brand-bg rounded-lg text-brand-primary"><Icons.Document /></span> Fiches de Paie
                </h4>
                <div className="space-y-3">
                  {myPayslips.length > 0 ? myPayslips.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200 group">
                      <div>
                        <p className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-brand-primary transition-colors">{p.month} {p.year}</p>
                        <p className="text-xs text-gray-500">PDF • 1.2 MB</p>
                      </div>
                      <button className="text-gray-400 hover:text-brand-primary p-2 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      </button>
                    </div>
                  )) : <p className="text-gray-500 text-sm italic">Aucune fiche disponible.</p>}
                </div>
              </div>

              {/* Other Resources */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="p-2 bg-brand-bg rounded-lg text-brand-primary"><Icons.Academic /></span> Ressources RH
                </h4>
                <div className="space-y-3">
                  {resources.map(r => (
                    <div key={r.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200 group">
                      <div>
                        <p className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-brand-primary transition-colors">{r.title}</p>
                        <p className="text-xs text-gray-500">{r.type} • {r.size}</p>
                      </div>
                      <button className="text-gray-400 hover:text-brand-primary p-2 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'tickets':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Support & Tickets</h3>
              <button 
                onClick={() => setIsNewIssueModalOpen(true)}
                className="px-6 py-2 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                + Nouveau Ticket
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {issues.map(issue => (
                <div key={issue.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-brand-light transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      issue.status === 'En cours' ? 'bg-orange-100 text-orange-800' : 
                      issue.status === 'Résolu' ? 'bg-green-100 text-green-800' : 'bg-brand-bg text-brand-dark'
                    }`}>
                      {issue.status}
                    </span>
                    <span className="text-xs text-gray-500">{issue.date}</span>
                  </div>
                  <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{issue.type}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'leave_requests':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Mes Congés & Absences</h3>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-dark transition-all duration-300 shadow-md hover:shadow-lg"
              >
                + Nouvelle Demande
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase mb-2">Solde Congés Payés</h4>
                <p className="text-3xl font-bold text-brand-primary">18.5 <span className="text-sm text-gray-400 font-normal">jours</span></p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase mb-2">RTT Restants</h4>
                <p className="text-3xl font-bold text-purple-600">4 <span className="text-sm text-gray-400 font-normal">jours</span></p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase mb-2">En attente</h4>
                <p className="text-3xl font-bold text-orange-500">{leaveRequests.filter(r => r.status === 'En attente').length} <span className="text-sm text-gray-400 font-normal">demandes</span></p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h4 className="font-bold text-gray-800 dark:text-white">Historique des demandes</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4 font-bold">Type</th>
                      <th className="px-6 py-4 font-bold">Dates</th>
                      <th className="px-6 py-4 font-bold">Durée</th>
                      <th className="px-6 py-4 font-bold">Statut</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {leaveRequests.length > 0 ? leaveRequests.map(req => (
                      <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{req.type || req.reason || 'Congé'}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {req.dates || (req.start_date && req.end_date ? `${new Date(req.start_date).toLocaleDateString()} - ${new Date(req.end_date).toLocaleDateString()}` : '-')}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {req.duration || (req.start_date && req.end_date ? Math.ceil((new Date(req.end_date) - new Date(req.start_date)) / (1000 * 60 * 60 * 24) + 1) + ' jours' : '-')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-start gap-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              req.status === 'Validé' || req.status === 'approved' ? 'bg-green-100 text-green-800' :
                              req.status === 'Refusé' || req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {req.status === 'approved' ? 'Validé' : req.status === 'rejected' ? 'Refusé' : req.status === 'pending' ? 'En attente' : req.status}
                            </span>
                            {(req.status === 'Refusé' || req.status === 'rejected') && (req.rejectionReason || req.rejection_reason) && (
                              <span className="text-xs text-red-500 italic max-w-[200px] break-words">
                                Motif: {req.rejectionReason || req.rejection_reason}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {(req.status === 'En attente' || req.status === 'pending') ? (
                            <button 
                              onClick={() => {
                                if(window.confirm('Voulez-vous vraiment annuler cette demande ?')) {
                                  // TODO: Implement cancel logic
                                  console.log('Cancel request', req.id);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                            >
                              Annuler
                            </button>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600 text-sm">-</span>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">Aucune demande de congé pour le moment.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'training':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Formation & Développement</h3>
                <p className="text-gray-500 dark:text-gray-400">Développez vos compétences</p>
              </div>
              <button 
                onClick={() => setIsCatalogOpen(true)}
                className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-dark transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Catalogue de formations
              </button>
            </div>

            {/* My Trainings */}
            <div>
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-brand-primary rounded-full"></span>
                Mes Formations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainings.filter(t => t.participants.includes(user?.id || 1)).length > 0 ? (
                  trainings.filter(t => t.participants.includes(user?.id || 1)).map(training => (
                    <div key={training.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          training.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                          training.status === 'En cours' ? 'bg-brand-bg text-brand-dark' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {training.status}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(training.date).toLocaleDateString()}</span>
                      </div>
                      <h5 className="font-bold text-lg text-gray-800 dark:text-white mb-2">{training.title}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{training.type} • {training.duration}</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                        <div 
                          className={`h-2 rounded-full ${training.status === 'Terminé' ? 'bg-green-500' : 'bg-brand-primary'}`} 
                          style={{ width: training.status === 'Terminé' ? '100%' : '45%' }}
                        ></div>
                      </div>
                      <button 
                        onClick={() => setSelectedTrainingContent(training)}
                        className="w-full py-2 text-sm font-medium text-brand-primary border border-brand-primary rounded-lg hover:bg-brand-bg transition-colors"
                      >
                        Accéder au contenu
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500">Aucune formation en cours.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Trainings */}
            <div>
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                Recommandé pour vous
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trainings.filter(t => !t.participants.includes(user?.id || 1)).slice(0, 2).map((training, idx) => (
                  <div key={training.id} className={`rounded-xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer ${idx % 2 === 0 ? 'bg-gradient-to-br from-purple-600 to-indigo-700' : 'bg-gradient-to-br from-pink-500 to-rose-600'}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                    <h5 className="font-bold text-xl mb-2 relative z-10">{training.title}</h5>
                    <p className="text-white/80 text-sm mb-6 relative z-10 max-w-xs">{training.description || "Formation recommandée pour votre profil."}</p>
                    <button 
                      onClick={() => handleEnroll(training.id)}
                      className={`px-4 py-2 bg-white font-bold rounded-lg text-sm transition-colors relative z-10 ${idx % 2 === 0 ? 'text-purple-700 hover:bg-purple-50' : 'text-pink-600 hover:bg-pink-50'}`}
                    >
                      S'inscrire
                    </button>
                  </div>
                ))}
                {trainings.filter(t => !t.participants.includes(user?.id || 1)).length === 0 && (
                   <div className="col-span-full p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500">Aucune recommandation pour le moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Actualités de l'entreprise</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Filtrer
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {posts.map(post => (
                <div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-bg dark:bg-gray-700 flex items-center justify-center text-brand-dark font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.date} • {post.role || 'RH'}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {post.image && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                      <img src={post.image} alt="Post attachment" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex gap-6">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          (post.likedBy || []).includes(user?.id || 1) 
                            ? 'text-brand-primary font-bold' 
                            : 'text-gray-500 hover:text-brand-primary'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={(post.likedBy || []).includes(user?.id || 1) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                        <span className="text-sm font-medium">{post.likes} J'aime</span>
                      </button>
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <span className="text-sm font-medium">{post.comments ? post.comments.length : 0} Commentaires</span>
                      </button>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {visibleComments[post.id] && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 animate-fade-in">
                      <div className="space-y-4">
                        {post.comments && post.comments.map((comment, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                              {(typeof comment === 'string' ? 'A' : comment.author.charAt(0))}
                            </div>
                            <div className="flex-1">
                              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg rounded-tl-none shadow-sm">
                                <p className="text-xs font-bold text-gray-800 dark:text-white mb-1">
                                  {typeof comment === 'string' ? 'Anonyme' : comment.author}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {typeof comment === 'string' ? comment : comment.text}
                                </p>
                              </div>
                              {typeof comment !== 'string' && (
                                <p className="text-xs text-gray-400 mt-1 ml-1">
                                  {new Date(comment.date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-3 mt-4">
                          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold text-white">
                            {user.username.charAt(0)}
                          </div>
                          <div className="flex-1 flex gap-2">
                            <input 
                              type="text" 
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                              placeholder="Écrire un commentaire..." 
                              className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                            />
                            <button 
                              onClick={() => handleCommentSubmit(post.id)}
                              className="p-2 bg-brand-primary text-white rounded-full hover:bg-brand-dark transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            </button>
                          </div>
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
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Paramètres du Compte</h3>

            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Profil Public</h4>
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.username.charAt(0)}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom d'utilisateur</label>
                      <input type="text" value={user.username} disabled className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Poste</label>
                      <input type="text" value={user.post || 'Employé'} disabled className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input type="email" value="employe@benyaacoub.co" disabled className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Notifications</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Notifications par email</p>
                    <p className="text-sm text-gray-500">Recevoir un email pour chaque nouvelle annonce</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/30 dark:peer-focus:ring-brand-primary/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Rappels de pointage</p>
                    <p className="text-sm text-gray-500">Notification si oubli de pointage après 9h30</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/30 dark:peer-focus:ring-brand-primary/80 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Sécurité</h4>
              <button className="text-brand-primary hover:text-brand-dark font-medium text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                Changer le mot de passe
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-20">
            <h3 className="text-xl text-gray-500">Section en cours de développement 🚧</h3>
            <button onClick={() => setActiveTab('dashboard')} className="mt-4 text-indigo-600 hover:underline">Retour à l'accueil</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-gray-900 transition-colors duration-300 font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              BY
            </div>
            <span className="font-bold text-xl text-gray-800 dark:text-white hidden md:block">Ben Yaacoub Co.</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
            {navItems.slice(0, 5).map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); if(item.id === 'leave_requests') markAsSeen('leave'); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
                {item.notification > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{item.notification}</span>
                )}
              </button>
            ))}
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
            <button onClick={() => setActiveTab('settings')} className="p-2 text-gray-500 hover:text-gray-800">⚙️</button>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 dark:text-white">{user.username}</p>
                <p className="text-xs text-gray-500">{user.post || 'Employé'}</p>
              </div>
              <button onClick={onLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {renderContent()}
      </main>

      {/* New Issue Modal (Example of Modal) */}
      {isNewIssueModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Nouveau Ticket</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                <select value={newIssueType} onChange={(e) => setNewIssueType(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="Matériel">Matériel</option>
                  <option value="Logiciel">Logiciel</option>
                  <option value="RH">RH</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea value={newIssueDesc} onChange={(e) => setNewIssueDesc(e.target.value)} className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32" placeholder="Décrivez votre problème..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsNewIssueModalOpen(false)} className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium">Annuler</button>
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
                  setIsNewIssueModalOpen(false);
                  setNewIssueDesc('');
                }
              }} className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 dark:shadow-none">Envoyer</button>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Modal */}
      {isCatalogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Catalogue de Formations</h3>
              <button onClick={() => setIsCatalogOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trainings.filter(t => !t.participants.includes(user?.id || 1)).map(training => (
                  <div key={training.id} className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-brand-primary dark:hover:border-brand-primary transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">{training.type}</span>
                      <span className="text-sm text-gray-500">{new Date(training.date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{training.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{training.description || "Aucune description disponible."}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-medium text-gray-500">Durée: {training.duration}</span>
                      <button 
                        onClick={() => handleEnroll(training.id)}
                        className="px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-dark transition-colors"
                      >
                        S'inscrire
                      </button>
                    </div>
                  </div>
                ))}
                {trainings.filter(t => !t.participants.includes(user?.id || 1)).length === 0 && (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    Toutes les formations disponibles sont déjà dans votre liste.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Modal */}
      {selectedTrainingContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-brand-primary text-white">
              <div>
                <h3 className="text-2xl font-bold">{selectedTrainingContent.title}</h3>
                <p className="text-blue-100 text-sm">{selectedTrainingContent.type} • {selectedTrainingContent.duration}</p>
              </div>
              <button onClick={() => setSelectedTrainingContent(null)} className="text-white/80 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-4 hidden md:block">
                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase text-xs tracking-wider">Modules</h4>
                <ul className="space-y-2">
                  <li className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border-l-4 border-brand-primary cursor-pointer">
                    <p className="font-bold text-sm text-gray-800 dark:text-white">Introduction</p>
                    <p className="text-xs text-gray-500">10 min</p>
                  </li>
                  <li className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-600 dark:text-gray-400">
                    <p className="font-medium text-sm">Chapitre 1: Les bases</p>
                    <p className="text-xs text-gray-500">45 min</p>
                  </li>
                  <li className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-600 dark:text-gray-400">
                    <p className="font-medium text-sm">Chapitre 2: Avancé</p>
                    <p className="text-xs text-gray-500">60 min</p>
                  </li>
                  <li className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-600 dark:text-gray-400">
                    <p className="font-medium text-sm">Quiz Final</p>
                    <p className="text-xs text-gray-500">20 min</p>
                  </li>
                </ul>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-gray-100 dark:bg-gray-900/50">
                <div className="bg-black rounded-xl aspect-video mb-8 flex items-center justify-center text-white">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p>Lecteur Vidéo (Simulation)</p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4">À propos de ce cours</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {selectedTrainingContent.description || "Ce cours vous permettra d'acquérir les compétences fondamentales et avancées nécessaires pour maîtriser ce sujet. Suivez les modules à votre rythme et validez vos acquis avec le quiz final."}
                  </p>
                  
                  <h5 className="font-bold text-gray-800 dark:text-white mb-2">Ressources téléchargeables</h5>
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      Support de cours.pdf
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      Exercices.zip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Widget */}
      {isChatOpen ? (
        <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-slide-up border border-gray-200 dark:border-gray-700">
          <ChatWindow user={user} onClose={() => setIsChatOpen(false)} />
        </div>
      ) : (
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-transform hover:scale-110 z-50" onClick={() => setIsChatOpen(true)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </button>
      )}
    </div>
  );
}

export default EmployeePortal;