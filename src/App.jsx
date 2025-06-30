import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Flights from './pages/Flights';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './context/AuthProvider';

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <nav style={nav}>
        <Link to="/" style={link}>Dashboard</Link>
        <Link to="/flights" style={link}>Flights</Link>
        {!currentUser && <Link to="/login" style={link}>Login</Link>}
        {!currentUser && <Link to="/signup" style={link}>Signup</Link>}
        {currentUser && <button onClick={() => auth.signOut()} style={linkBtn}>Logout</button>}
      </nav>

      <main style={{ padding: '24px' }}>
        <Routes>
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/flights" element={<Protected><Flights /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </Router>
  );
}

function Protected({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

const nav = {
  display: 'flex',
  gap: '16px',
  background: '#3f51b5',
  padding: '12px 24px',
};

const link = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const linkBtn = {
  ...link,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};
<div style={{
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '20px',
  backgroundColor: '#f0f0f0',
  textAlign: 'center'
}}>
  <FlightTracker />
</div>
export default App;