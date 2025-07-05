// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';

import { auth }                from './firebase';
import { AuthProvider, useAuth } from './context/AuthProvider';

import DashboardLayout from './layouts/DashboardLayout';
import Dashboard       from './pages/Dashboard';
import Flights         from './pages/Flights';
import Login           from './pages/Login';
import Signup          from './pages/Signup';

import './App.css';

// Redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public auth routes (no layout) */}
          <Route path="/login"  element={<Login  />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes use DashboardLayout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/"        element={<Dashboard />} />
            <Route path="/flights" element={<Flights  />} />
          </Route>

          {/* Redirect anything else back to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}