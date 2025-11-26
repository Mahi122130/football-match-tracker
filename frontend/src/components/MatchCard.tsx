import React from 'react';
import type { Match } from '../types';

interface MatchCardProps {
  match: Match;
  onViewDetails: (matchId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onViewDetails }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ongoing': return { background: '#dcfce7', color: '#166534' };
      case 'scheduled': return { background: '#dbeafe', color: '#1e40af' };
      case 'finished': return { background: '#f3f4f6', color: '#374151' };
      default: return { background: '#f3f4f6', color: '#374151' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing': return 'LIVE';
      case 'scheduled': return 'UPCOMING';
      case 'finished': return 'FINISHED';
      default: return status;
    }
  };

  const statusStyle = getStatusStyle(match.status);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      borderLeft: '4px solid #10b981',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{
              backgroundColor: statusStyle.background,
              color: statusStyle.color,
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {getStatusText(match.status)}
            </span>
            {match.startTime && (
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                {new Date(match.startTime).toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>{match.teamA}</h3>
            </div>
            
            <div style={{ margin: '0 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                {match.scoreA} - {match.scoreB}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Score</div>
            </div>
            
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>{match.teamB}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          {match.events.filter(e => e.type === 'goal').length} goals • 
          {match.events.filter(e => e.type === 'yellow_card').length} yellow • 
          {match.events.filter(e => e.type === 'red_card').length} red
        </div>
        <button
          onClick={() => onViewDetails(match.id)}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};