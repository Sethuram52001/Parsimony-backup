import axios from 'axios';
import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    event.preventDefault();
    console.log('clicked login');
    const loginData = JSON.stringify({
      email,
      password,
    });
    const res = await axios.post('http://localhost:5000/api/login', {
      loginData,
    });
    if (res.data.user) {
      alert('login successful');
      localStorage.setItem('token', res.data.user);
      console.log(res.data.user);
      window.location.href = '/dashboard';
    } else {
      alert('invalid login credentials');
    }
  };

  return (
    <React.Fragment>
      <form>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" value="Login" onClick={handleLogin} />
      </form>
    </React.Fragment>
  );
};

export default LoginForm;
