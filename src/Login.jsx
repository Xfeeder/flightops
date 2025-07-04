// src/pages/Login.jsx
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function Login() {
  const email = useRef();
  const password = useRef();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email.current.value, password.current.value);
      console.log("✅ Login successful");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("❌ Login failed:", err.message);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
      <h2>🔐 Sign In</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '12px' }}>
          <label>Email</label><br />
          <input type="email" ref={email} required />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Password</label><br />
          <input type="password" ref={password} required />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Login;