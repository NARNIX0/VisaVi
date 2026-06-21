import React, { useState } from 'react';
import { InterviewList } from './components/InterviewList';
import { ChatInterface } from './components/ChatInterface';
import { FeedbackPanel } from './components/FeedbackPanel';
import { InterviewTimer } from './components/InterviewTimer';
import { Interview } from './types';

const UPCOMING_INTERVIEWS: Interview[] = [
  { id: '1', company: 'Deloitte', role: 'Graduate Analyst', date: 'Tomorrow', matchPercentage: 92 },
  { id: '2', company: 'Google', role: 'Product Analyst', date: 'May 20', matchPercentage: 88 },
  { id: '3', company: 'JPMorgan Chase', role: 'Financial Analyst', date: 'May 23', matchPercentage: 85 },
];

const App: React.FC = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);

  const startInterview = () => setIsSessionActive(true);
  const endInterview = () => setIsSessionActive(false);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f5f7f9' }}>
      <aside style={{ width: '300px', borderRight: '1px solid #ddd', padding: '20px', backgroundColor: '#fff' }}>
        <h2>Interviews</h2>
        
        {isSessionActive && <InterviewTimer isActive={isSessionActive} />}
        
        {!isSessionActive ? (
          <>
            <InterviewList interviews={UPCOMING_INTERVIEWS} />
            <button 
              style={{ marginTop: '20px', width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
              onClick={startInterview}
            >
              Start Practice Session
            </button>
            <button 
              style={{ marginTop: '10px', width: '100%', padding: '10px', cursor: 'pointer', background: 'none', border: '1px solid #ccc' }}
              onClick={() => console.log('Navigate to applications')}
            >
              View all applications
            </button>
          </>
        ) : (
          <button 
            style={{ marginTop: '20px', width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
            onClick={endInterview}
          >
            End Interview
          </button>
        )}
      </aside>
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <ChatInterface />
      </main>

      <aside style={{ width: '350px', borderLeft: '1px solid #ddd', padding: '20px', backgroundColor: '#fff' }}>
        <FeedbackPanel />
      </aside>
    </div>
  );
};

export default App;