import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // FastAPI OAuth2 expects form data
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await axios.post(`${API_URL}/login`, formData);
      setToken(res.data.access_token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to manage your tasks</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="primary-btn">Login</button>
        </form>
        <p className="switch-auth">Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
}
