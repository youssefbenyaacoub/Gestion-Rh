import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const endpoint = isLogin ? '/login' : '/register';
    const url = `http://localhost:5000${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          onLogin(data.user);
        } else {
          setMessage('Inscription réussie ! Veuillez vous connecter.');
          setIsLogin(true);
        }
      } else {
        setMessage(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      setMessage('Impossible de se connecter au serveur');
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom d'utilisateur :</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Se connecter' : "S'inscrire"}</button>
      </form>
      {message && <p className="message">{message}</p>}
      <p onClick={() => setIsLogin(!isLogin)} className="toggle-link">
        {isLogin ? "Pas de compte ? Inscrivez-vous ici." : "Déjà un compte ? Connectez-vous ici."}
      </p>
    </div>
  );
}

export default Login;
