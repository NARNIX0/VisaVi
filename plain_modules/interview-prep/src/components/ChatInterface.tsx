import React from 'react';

export const ChatInterface: React.FC = () => {
  const mockMessages = [
    { id: 1, sender: 'AI', text: 'Hello! Are you ready for your mock interview?' },
    { id: 2, sender: 'User', text: 'Yes, I am ready to practice for the Deloitte role.' }
  ];

  return (
    <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      {mockMessages.map(msg => (
        <div key={msg.id} style={{
          alignSelf: msg.sender === 'User' ? 'flex-end' : 'flex-start',
          backgroundColor: msg.sender === 'User' ? '#007bff' : '#e9e9eb',
          color: msg.sender === 'User' ? 'white' : 'black',
          padding: '10px 15px',
          borderRadius: '18px',
          marginBottom: '10px',
          maxWidth: '70%'
        }}>
          {msg.text}
        </div>
      ))}
      <input 
        type="text" 
        placeholder="Type your response..." 
        style={{ width: '100%', padding: '12px', marginTop: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
      />
    </div>
  );
};