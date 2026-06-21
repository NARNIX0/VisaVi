import React from 'react';
import { InterviewMetrics } from '../types';

interface Props {
  metrics?: InterviewMetrics;
}

export const FeedbackPanel: React.FC<Props> = ({ 
  metrics = {
    communication: 8.5,
    confidence: 7.8,
    structure: 8.0,
    relevance: 9.0,
    technicalDepth: 7.2,
    questionsAnswered: 3,
    totalQuestions: 8,
    suggestions: [
      "Good structure in your answer",
      "Try to quantify your impact",
      "Add more about teamwork"
    ]
  } 
}) => {
  // Defensive check for metrics
  if (!metrics) {
    return <div style={{ padding: '10px', color: 'red' }}>Error: Metrics data is unavailable.</div>;
  }

  const scoreItems = [
    { label: 'Communication', value: metrics.communication },
    { label: 'Confidence', value: metrics.confidence },
    { label: 'Structure', value: metrics.structure },
    { label: 'Relevance', value: metrics.relevance },
    { label: 'Technical Depth', value: metrics.technicalDepth },
  ];

  const progressPercentage = metrics.totalQuestions > 0 
    ? (metrics.questionsAnswered / metrics.totalQuestions) * 100 
    : 0;

  return (
    <div style={{ padding: '10px' }} data-testid="feedback-panel">
      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Live Feedback</h3>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ 
          position: 'relative', 
          width: '100px', 
          height: '100px', 
          margin: '0 auto',
          borderRadius: '50%',
          background: `conic-gradient(#007bff ${progressPercentage}%, #e9e9eb 0)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: 'white', 
            borderRadius: '50%', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '0.8rem'
          }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
              {metrics.questionsAnswered}/{metrics.totalQuestions}
            </span>
            <span>Questions</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {scoreItems.map((item) => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#555' }}>{item.label}</span>
            <span style={{ 
              fontWeight: 'bold', 
              color: '#28a745', 
              backgroundColor: '#eafaf1', 
              padding: '2px 8px', 
              borderRadius: '12px',
              minWidth: '45px',
              textAlign: 'center'
            }}>
              {(item.value || 0).toFixed(1)}/10
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Suggestions:</h4>
        {metrics.suggestions && metrics.suggestions.length > 0 ? (
          <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: '#444' }}>
            {metrics.suggestions.map((suggestion, index) => (
              <li key={`suggestion-${index}`} style={{ marginBottom: '8px' }}>
                {suggestion}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
            Awaiting AI analysis to provide live suggestions...
          </p>
        )}
      </div>
    </div>
  );
};