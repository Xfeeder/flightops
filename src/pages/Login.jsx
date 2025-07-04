import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import DebugPanel from '../components/DebugPanel';

export default function Login() {
  const email = useRef();
  const password = useRef();
  const [logs, setLogs] = useState([]);
  const showDebug = new URLSearchParams(window.location.search).has('debug');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const log = (msg) => setLogs((all) => [...all, msg]);

  const handleLogin = async (e) => {
    e.preventDefault();
    log('🚀 handleLogin fired');
    log('🔑 attempting Firebase signIn…');

    try {
      await signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      );
      log('✅ Login successful');
      navigate('/', { replace: true });
    } catch (err) {
      log(`❌ Login failed: ${err.message}`);
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
      <h2>🔐 Sign In</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '12px' }}>
          <label>Email</label><br />
          <input type="email" ref={email} required />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Password</label><br />
          <input type="password" ref={password} required />
        </div>
        <button type="submit">Login</button>
      </form>

      {showDebug && <DebugPanel messages={logs} />}
    </div>
  );
}