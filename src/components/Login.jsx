import React, { useState } from 'react';
import './Login.css'; // Keeping import but we will use Tailwind classes mostly

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [post, setPost] = useState('Développeur');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const endpoint = isLogin ? '/login' : '/register';
    const url = `http://localhost:5000${endpoint}`;

    const body = isLogin 
      ? { username, password }
      : { username, password, post, registrationCode };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          onLogin(data.user);
        } else {
          setMessage('Inscription réussie ! Veuillez vous connecter.');
          setIsLogin(true);
          setPassword('');
          setRegistrationCode('');
        }
      } else {
        setMessage(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      setMessage('Impossible de se connecter au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-gray-800">
      
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-brand-dark dark:text-brand-light mb-6">Ben Yaacoub Company</h1>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {isLogin ? 'Bienvenue' : 'Créer un compte'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              {isLogin ? 'Connectez-vous à votre espace RH' : 'Rejoignez la plateforme RH'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="Votre identifiant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <>
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Poste
                  </label>
                  <select
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  >
                    <option value="Développeur">Développeur</option>
                    <option value="Manager">Manager</option>
                    <option value="RH">RH</option>
                    <option value="Designer">Designer</option>
                    <option value="Comptable">Comptable</option>
                  </select>
                </div>

                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code d'entreprise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={registrationCode}
                    onChange={(e) => setRegistrationCode(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="Code requis pour l'inscription"
                  />
                  <p className="text-xs text-gray-500 mt-1">Demandez ce code à votre administrateur.</p>
                </div>
              </>
            )}

            {message && (
              <div className={`p-3 rounded-lg text-sm ${message.includes('réussie') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                onClick={() => alert("Connexion Google non configurée (nécessite API Key)")}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
              }}
              className="text-sm text-brand-dark hover:text-brand-medium dark:text-brand-light dark:hover:text-brand-primary font-medium transition-colors"
            >
              {isLogin ? "Pas encore de compte ? Créer un compte" : "Déjà inscrit ? Se connecter"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block md:w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80')" }}>
        <div className="absolute inset-0 bg-brand-dark bg-opacity-40 flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h2 className="text-4xl font-bold mb-4">Portail Collaborateurs</h2>
            <p className="text-lg text-gray-100">Gérez vos employés, congés et paies en toute simplicité. Espace pour les employés.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
