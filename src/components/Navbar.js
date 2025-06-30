import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate('/login'))
      .catch((err) => console.error('Logout error:', err));
  };

  return (
    <nav className="navbar">
      <h2>✈️ FlightOps</h2>
      <ul>
        <li><Link to="/flights">Flights</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;    