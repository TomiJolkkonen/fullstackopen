import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        username,
        password,
      });
      const loggedInUser = response.data;
      setUser(loggedInUser);
      window.localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    } catch (exception) {
      alert('Invalid username or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={login}>
        <div>
          Username: <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
