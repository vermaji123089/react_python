import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Dashboard({ token, setToken }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // Fetch user details
    axios.get(`${API_URL}/users/me`, config)
      .then(res => setUser(res.data))
      .catch(() => logout());

    // Fetch todos
    fetchTodos(config);
  }, [token, navigate]);

  const fetchTodos = (config) => {
    axios.get(`${API_URL}/todos`, config)
      .then(res => setTodos(res.data))
      .catch(err => console.log(err));
  };

  const logout = () => {
    setToken('');
    navigate('/login');
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/todos`, 
        { title: newTodo, description: "", completed: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([...todos, res.data]);
      setNewTodo('');
    } catch (err) {
      console.log(err);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const res = await axios.put(`${API_URL}/todos/${todo.id}`, 
        { completed: !todo.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.map(t => t.id === todo.id ? res.data : t));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2>✓ TaskMaster</h2>
        <div className="user-menu">
          <span>{user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="todo-main">
        <div className="todo-card">
          <h3>Your Tasks</h3>
          
          <form onSubmit={handleAddTodo} className="add-todo-form">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={newTodo} 
              onChange={e => setNewTodo(e.target.value)} 
            />
            <button type="submit">Add</button>
          </form>

          <ul className="todo-list">
            {todos.length === 0 && <p className="empty-state">You have no tasks! 🎉</p>}
            {todos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-content" onClick={() => toggleComplete(todo)}>
                  <input type="checkbox" checked={todo.completed} readOnly />
                  <span>{todo.title}</span>
                </div>
                <button onClick={() => deleteTodo(todo.id)} className="delete-btn">×</button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
