import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Add relevant styling

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Validate if the email is a valid Gmail address
  const validateEmail = (email) => {
    const re = /^[^\s@]+@gmail\.com$/; // Only Gmail addresses allowed
    return re.test(String(email).toLowerCase());
  };

  // Password must be at least 8 characters, include one uppercase letter, one number, and one special character
  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(password);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      alert('Please enter a valid Gmail address (e.g., user@gmail.com).');
      return;
    }
    if (!validatePassword(password)) {
      alert('Password must be at least 8 characters long, contain one number, one letter, and one special character.');
      return;
    }

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      navigate('/profile');
    } else {
      alert('Invalid credentials!');
    }
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      alert('Please enter a valid Gmail address (e.g., user@gmail.com).');
      return;
    }
    if (!validatePassword(password)) {
      alert('Password must be at least 8 characters long, contain one number, one letter, and one special character.');
      return;
    }

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      alert('Registration successful! Please log in.');
      setIsRegistering(false); // Switch back to login form
    } else {
      alert('Error registering user');
    }
  };

  return (
    <div className="login-page">
      <nav className="navbar">
        <h1>Stock Market Tracker</h1>
      </nav>
      <div className="login-container">
        <h1>{isRegistering ? 'Register' : 'Login'}</h1>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={isRegistering ? handleRegister : handleLogin}>
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
