import axios from 'axios';
import React, { useState } from 'react';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const registrationData = JSON.stringify({
      name,
      email,
      password,
    });

    const response = await axios.post('http://localhost:5000/api/register', {
      registrationData,
    });
    console.log(response);
  };

  return (
    <React.Fragment>
      <form>
        <label>
          Name:
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <input type="submit" value="Register" onClick={handleRegister} />
      </form>
    </React.Fragment>
  );
};

export default RegistrationForm;
