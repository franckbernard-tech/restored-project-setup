import React from 'react';

function Status({ isConnected, onSync, n8nStatus }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#333',
      marginBottom: '20px',
      borderRadius: '8px'
    }}>
      <p style={{ margin: 0, color: isConnected ? '#10b981' : '#ef4444' }}>
        Status: {isConnected ? 'Connected to n8n' : 'Not connected'}
      </p>
      <p style={{ margin: 0, color: n8nStatus.online ? '#10b981' : '#ef4444' }}>
        n8n Status: {n8nStatus.message} <span style={{ color: n8nStatus.online ? '#10b981' : '#ef4444' }}>●</span>
      </p>
      <button
        onClick={onSync}
        style={{
          padding: '8px 16px',
          backgroundColor: '#a855f7',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Force Synchronization
      </button>
    </div>
  );
}

export default Status;
