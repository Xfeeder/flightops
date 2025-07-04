// src/App.jsx

import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate
} from 'react-router-dom'

import { auth } from './firebase'
import { AuthProvider, useAuth } from './context/AuthProvider'

import Dashboard from './pages/Dashboard'
import Flights from './pages/Flights'
import Login from './pages/Login'
import Signup from './pages/Signup'
import FlightTracker from './components/FlightTracker'

import './App.css'

/**
 * Wraps protected routes, redirecting to /login if not authenticated.
 */
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? children : <Navigate to="/login" replace />
}

/**
 * Main application content with navigation, routes, and conditional footer.
 */
function AppContent() {
  const { currentUser } = useAuth()

  return (
    <Router>
      <nav className="app-nav">
        <NavLink to="/"      className="app-link">Dashboard</NavLink>
        <NavLink to="/flights" className="app-link">Flights</NavLink>

        {currentUser ? (
          <button
            onClick={() => auth.signOut()}
            className="button-link"
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink to="/login"  className="app-link">Login</NavLink>
            <NavLink to="/signup" className="app-link">Signup</NavLink>
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

          <Route path="/login"  element={<Login />}  />
          <Route path="/signup" element={<Signup />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {currentUser && (
        <footer className="flight-tracker-footer">
          <FlightTracker />
        </footer>
      )}
    </Router>
  )
}

/**
 * Wraps the entire app with AuthProvider for context-based authentication.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}