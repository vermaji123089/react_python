import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // We use import.meta.env.VITE_API_URL for production
    // If it's not set (like in local development), we fall back to localhost
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    
    axios
      .get(`${apiUrl}/users`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>Users List</h1>

      {users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default App;