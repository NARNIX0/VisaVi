import React, { useState, useEffect } from 'react';

interface Props {
  isActive: boolean;
}

export const InterviewTimer: React.FC<Props> = ({ isActive }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ 
      fontSize: '1.2rem', 
      fontWeight: 'bold', 
      color: '#d9534f', 
      fontFamily: 'monospace',
      padding: '10px',
      border: '1px solid #d9534f',
      borderRadius: '4px',
      textAlign: 'center',
      marginBottom: '10px'
    }}>
      {formatTime(seconds)}
    </div>
  );
};