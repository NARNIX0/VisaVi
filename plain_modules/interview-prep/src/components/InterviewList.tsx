import React from 'react';
import { Interview } from '../types';

interface Props {
  interviews: Interview[];
}

export const InterviewList: React.FC<Props> = ({ interviews }) => {
  return (
    <div className="interview-list">
      {interviews.map((interview) => (
        <div key={interview.id} style={{
          padding: '15px',
          margin: '10px 0',
          borderRadius: '8px',
          border: '1px solid #eee',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ fontWeight: 'bold' }}>{interview.company} {interview.role}</div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>({interview.date}, {interview.matchPercentage}% match)</div>
        </div>
      ))}
    </div>
  );
};