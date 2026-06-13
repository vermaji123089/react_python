import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_URL}/register`, {
        name,
        email,
        password
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account ✨</h2>
        <p className="subtitle">Join us and get organized</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="primary-btn">Sign Up</button>
        </form>
        <p className="switch-auth">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
