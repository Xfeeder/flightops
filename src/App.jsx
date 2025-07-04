import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom';
import { auth } from './firebase';
import { AuthProvider, useAuth } from './context/AuthProvider';
import Dashboard from './pages/Dashboard';
import Flights from './pages/Flights';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FlightTracker from './components/FlightTracker';
import './App.css';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <nav className="app-nav">
        <Link to="/" className="app-link">Dashboard</Link>
        <Link to="/flights" className="app-link">Flights</Link>

        {currentUser ? (
          <button
            onClick={() => auth.signOut()}
            className="button-link"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="app-link">Login</Link>
            <Link to="/signup" className="app-link">Signup</Link>
          </>
        )}
      </nav>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flights"
            element={
              <ProtectedRoute>
                <Flights />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {currentUser && (
        <footer className="flight-tracker-footer">
          <FlightTracker />
        </footer>
      )}
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}