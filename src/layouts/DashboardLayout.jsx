// src/layouts/DashboardLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './DashboardLayout.css';

export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="logo">Xfeeder Airlines</div>
        <nav>
          <NavLink to="/"        className="nav-link">Dashboard</NavLink>
          <NavLink to="/flights" className="nav-link">Flights</NavLink>
          <NavLink to="/reports" className="nav-link">Reports</NavLink>
          <button className="logout-btn">Logout</button>
        </nav>
      </header>

      <aside className="sidebar">
        <ul>
          <li>Overview</li>
          <li>Schedules</li>
          <li>Aircraft</li>
          <li>Crews</li>
        </ul>
      </aside>

      <main className="content">
        <Outlet />
      </main>

      <footer className="footer">
        Flight Tracker Live Feed
      </footer>
    </div>
  );
}