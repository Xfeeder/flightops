import React from 'react';

export default function DebugPanel({ messages }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '160px',
        overflowY: 'auto',
        background: '#f9f9f9',
        borderTop: '1px solid #ccc',
        padding: '8px',
        fontSize: '12px',
        lineHeight: '1.4',
        zIndex: 9999,
      }}
    >
      <strong>Debug Log:</strong>
      {messages.map((msg, idx) => (
        <div key={idx}>{msg}</div>
      ))}
    </div>
  );
}