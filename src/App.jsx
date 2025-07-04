// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  Outlet
} from 'react-router-dom';

import { auth }             from './firebase';
import { AuthProvider, useAuth } from './context/AuthProvider';

import Dashboard    from './pages/Dashboard';
import Flights      from './pages/Flights';
import Login        from './pages/Login';
import Signup       from './pages/Signup';
import FlightTracker from './components/FlightTracker';

import './App.css';

// Redirects to /login if not signed in
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

// Layout wrapper for all protected pages
function AppLayout() {
  const { currentUser } = useAuth();

  return (
    <>
      <nav className="app-nav">
        <NavLink to="/"       className="app-link">Dashboard</NavLink>
        <NavLink to="/flights" className="app-link">Flights</NavLink>
        <button onClick={() => auth.signOut()} className="button-link">
          Logout
        </button>
      </nav>

      <main className="app-main">
        <Outlet />
      </main>

      {currentUser && (
        <footer className="flight-tracker-footer">
          <FlightTracker />
        </footer>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login"  element={<Login  />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes wrapped in AppLayout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/"        element={<Dashboard />} />
            <Route path="/flights" element={<Flights  />} />
          </Route>

          {/* Fallback: redirect anything else to / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}