import React, { useState } from 'react';
import Message from './Message';
import InputBox from './InputBox';
import { detectIntent } from '../utils/nlp';

const ChatWindow = ({ user, onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Bonjour test comment je peut aider toi aujourdui", sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [flowState, setFlowState] = useState(null); // null, 'ASK_START_DATE', 'ASK_END_DATE', 'ASK_REASON'
  const [flowData, setFlowData] = useState({});

  const handleSend = async (text) => {
    const userMessage = { text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    let responseText = "";
    let intentResult = null;

    // Handle Conversation Flows
    if (flowState === 'ASK_START_DATE') {
      // Accept YYYY-MM-DD from input type=date
      if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        const startDate = text;
        let endDateStr = "";

        // If duration was pre-calculated (e.g. 1 day or 1 week), calculate end date automatically
        if (flowData.duration) {
          const start = new Date(startDate);
          const end = new Date(start);
          end.setDate(start.getDate() + (flowData.duration - 1)); // -1 because start date counts as day 1
          endDateStr = end.toISOString().split('T')[0];
          
          // Check Availability immediately
          try {
            if (!user || !user.id) throw new Error("Utilisateur non identifié");
            const checkRes = await fetch('http://localhost:5000/api/check-leave-availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, startDate, endDate: endDateStr })
            });
            
            if (checkRes.ok) {
                setFlowData(prev => ({ ...prev, startDate: startDate, endDate: endDateStr }));
                setFlowState('ASK_REASON');
                const formatDate = (d) => d.split('-').reverse().join('/');
                responseText = `C'est noté pour ${flowData.duration} jour(s) (du ${formatDate(startDate)} au ${formatDate(endDateStr)}). Quelle est la raison de ce congé ?`;
            } else {
                const errData = await checkRes.json();
                responseText = `Impossible de prendre congé à ces dates : ${errData.message}. Veuillez choisir d'autres dates.`;
                setFlowState(null); // Reset flow or ask for dates again
            }
          } catch (e) {
             responseText = "Je n'arrive pas à accéder au planning pour le moment. Veuillez vérifier votre connexion ou réessayer plus tard.";
             setFlowState(null);
          }

        } else {
          setFlowData(prev => ({ ...prev, startDate: startDate }));
          setFlowState('ASK_END_DATE');
          responseText = "Merci. Quelle est la date de fin ?";
        }
      } else {
        responseText = "Format invalide. Veuillez utiliser le sélecteur de date.";
      }
    } else if (flowState === 'ASK_END_DATE') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        const endDateStr = text;
        
        // Check Availability immediately
        try {
            if (!user || !user.id) throw new Error("Utilisateur non identifié");
            const checkRes = await fetch('http://localhost:5000/api/check-leave-availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, startDate: flowData.startDate, endDate: endDateStr })
            });
            
            if (checkRes.ok) {
                setFlowData(prev => ({ ...prev, endDate: endDateStr }));
                setFlowState('ASK_REASON');
                responseText = "C'est noté. Quelle est la raison de ce congé ?";
            } else {
                const errData = await checkRes.json();
                responseText = `Impossible de prendre congé à ces dates : ${errData.message}. Veuillez choisir d'autres dates.`;
                setFlowState(null);
            }
        } catch (e) {
             responseText = "Je n'arrive pas à accéder au planning pour le moment. Veuillez vérifier votre connexion ou réessayer plus tard.";
             setFlowState(null);
        }
      } else {
        responseText = "Format invalide. Veuillez utiliser le sélecteur de date.";
      }
    } else if (flowState === 'ASK_REASON') {
      const reason = text;
      try {
        const res = await fetch('http://localhost:5000/api/leave-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            startDate: flowData.startDate,
            endDate: flowData.endDate,
            reason: reason
          })
        });
        
        const data = await res.json();
        if (res.ok) {
          responseText = "Votre demande de congé a été envoyée aux RH pour validation. Vous recevrez une notification une fois traitée.";
        } else {
          responseText = `Impossible de soumettre la demande : ${data.message}`;
        }
      } catch (error) {
        console.error("Error submitting leave request:", error);
        responseText = "Je n'ai pas pu contacter le serveur.";
      }
      setFlowState(null);
      setFlowData({});
    } else if (flowState === 'ASK_ABSENCE_REASON') {
        const reason = text;
        if (user && user.id) {
            try {
                const res = await fetch('http://localhost:5000/absences', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, reason: reason })
                });
                
                if (res.ok) {
                    responseText = "Votre absence a été signalée et est en attente de validation par les RH.";
                } else {
                    const errData = await res.json();
                    responseText = `Erreur lors du signalement : ${errData.message}`;
                }
            } catch (error) {
                responseText = "Erreur de connexion au serveur.";
            }
        } else {
            responseText = "Vous devez être connecté pour signaler une absence.";
        }
        setFlowState(null);
    } else {
      // Standard Intent Detection
      intentResult = detectIntent(text);
      responseText = intentResult.response;

      // Check if the intent requires fetching data from the database
      if (intentResult.tag === 'leave_request') {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('balance') || 
            lowerText.includes('how many days') || 
            lowerText.includes('remaining') ||
            lowerText.includes('solde') ||
            lowerText.includes('combien') ||
            lowerText.includes('reste')) {
          // User asking for balance
          try {
            const res = await fetch(`http://localhost:5000/daysoff/${user.id}`);
            if (res.ok) {
              const data = await res.json();
              responseText = `Il vous reste ${data.daysoff} jours de congé.`;
            } else {
              const errData = await res.json();
              responseText = `Erreur lors de la récupération du solde : ${errData.message}`;
            }
          } catch (error) {
            responseText = "Je n'ai pas pu me connecter au serveur pour vérifier votre solde.";
          }
        } else {
          // Initiate Leave Request Flow
          // Check for duration in the message
          let duration = null;
          if (lowerText.includes('1 jour') || lowerText.includes('un jour') || lowerText.includes('1 day')) {
            duration = 1;
          } else if (lowerText.includes('1 semaine') || lowerText.includes('une semaine') || lowerText.includes('1 week')) {
            duration = 7;
          } else if (lowerText.includes('2 jours')) duration = 2;
          else if (lowerText.includes('3 jours')) duration = 3;
          else if (lowerText.includes('5 jours')) duration = 5;

          setFlowData({ duration: duration });
          setFlowState('ASK_START_DATE');
          
          if (duration) {
             responseText = `Je peux vous aider à prendre ${duration} jour(s). Quelle est la date de début souhaitée ?`;
          } else {
             responseText = "Je peux vous aider à faire une demande de congé. Quelle est la date de début souhaitée ?";
          }
        }
      } else if (intentResult.tag === 'payslip' && (text.toLowerCase().includes('my') || text.toLowerCase().includes('ma') || text.toLowerCase().includes('latest') || text.toLowerCase().includes('dernière'))) {
        // User asking for payslip - Create a request
        console.log("Requesting payslip for user:", user);
        if (!user || !user.id) {
             responseText = "Erreur : Identifiant utilisateur manquant. Veuillez vous déconnecter et vous reconnecter.";
        } else {
            try {
                const res = await fetch('http://localhost:5000/api/payslip-requests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id })
                });
                
                if (res.ok) {
                    responseText = "Votre demande de fiche de paie a été envoyée aux RH. Vous recevrez une notification une fois validée.";
                } else {
                    const text = await res.text();
                    try {
                        const errData = JSON.parse(text);
                        responseText = `Erreur lors de la demande : ${errData.message}`;
                    } catch (e) {
                        responseText = `Erreur serveur (${res.status}) : Le serveur ne reconnaît pas cette requête. Veuillez redémarrer le serveur backend.`;
                    }
                }
            } catch (error) {
                console.error("Fetch error:", error);
                responseText = "Je n'ai pas pu envoyer votre demande pour le moment.";
            }
        }
    } else if (intentResult.tag === 'report_absence' || intentResult.tag === 'sick_leave') {
        // User reporting absence - Initiate Flow
        setFlowState('ASK_ABSENCE_REASON');
        responseText = "Veuillez indiquer la raison de votre absence.";
    }
    } // End of flowState else block

    // Add 3 seconds delay before bot response
    await new Promise(resolve => setTimeout(resolve, 1000)); // Reduced delay for better UX

    setIsTyping(false);
    
    // Determine input type for the bot message
    let inputType = 'text';
    if (responseText.includes("Quelle est la date") || responseText.includes("date de début") || responseText.includes("date de fin") || responseText.includes("sélecteur de date")) {
      inputType = 'date';
    }

    const botMessage = { 
      text: responseText, 
      sender: 'bot',
      suggestions: intentResult ? intentResult.suggestions : [],
      inputType: inputType
    };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-dark to-brand-primary rounded-full flex items-center justify-center text-white shadow-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-800 dark:text-white">Assistant RH</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">En ligne</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {messages.map((msg, index) => (
          <Message 
            key={index} 
            text={msg.text} 
            sender={msg.sender} 
            suggestions={msg.suggestions}
            onSuggestionClick={handleSend}
            inputType={msg.inputType}
            onInputChange={handleSend}
            user={user}
          />
        ))}
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-dark to-brand-primary rounded-full flex items-center justify-center text-white text-xs shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            </div>
            <div className="flex space-x-1 p-4 bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700 items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
      <InputBox onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;