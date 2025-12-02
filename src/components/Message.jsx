import React from 'react';

const Message = ({ text, sender, suggestions, onSuggestionClick, inputType, onInputChange, user }) => {
  const isUser = sender === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className={`flex max-w-[85%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-1 ${
          isUser 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white'
        }`}>
          {isUser ? (
            <span className="text-xs font-bold">{user ? user.username.substring(0, 2).toUpperCase() : 'ME'}</span>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
          )}
        </div>

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`
            p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative
            ${isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'}
          `}>
            <p className="whitespace-pre-wrap">{text}</p>
            {inputType === 'date' && (
              <input 
                type="date" 
                className="mt-3 w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                onChange={(e) => onInputChange(e.target.value)}
              />
            )}
          </div>
          
          {/* Timestamp (Optional - could be passed as prop) */}
          <span className={`text-[10px] text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'} opacity-0 group-hover:opacity-100 transition-opacity`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {suggestions && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestions.map((suggestion, index) => (
                <button 
                  key={index} 
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-white rounded-full text-xs font-bold hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all shadow-sm border border-indigo-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5"
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;