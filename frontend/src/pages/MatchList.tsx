import React, { useEffect, useState } from 'react';
import type { Match, SSEMessage } from '../types';
import { MatchCard } from '../components/MatchCard';

export const MatchList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8080/api/matches-stream');

    eventSource.onopen = () => {
      setConnected(true);
      console.log('SSE Connected for match list');
    };

    eventSource.onmessage = (event) => {
      try {
        const message: SSEMessage = JSON.parse(event.data);
        
        if (message.type === 'matches_update') {
          setMatches(message.data);
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      setConnected(false);
    };

    return () => {
      eventSource.close();
      setConnected(false);
    };
  }, []);

  const handleViewDetails = (matchId: string) => {
    window.location.href = `/match/${matchId}`;
  };

  const ongoingMatches = matches.filter(match => match.status === 'ongoing');
  const scheduledMatches = matches.filter(match => match.status === 'scheduled');
  const finishedMatches = matches.filter(match => match.status === 'finished');

  const renderMatchSection = (title: string, matchList: Match[]) => (
    matchList.length > 0 && (
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
          {title} ({matchList.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {matchList.map(match => (
            <MatchCard 
              key={match.id} 
              match={match} 
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
    )
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px 0' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            ⚽ Football Match Tracker
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>Live updates from matches around the world</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
            <div style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: connected ? '#dcfce7' : '#fee2e2',
              color: connected ? '#166534' : '#dc2626'
            }}>
              {connected ? '🔵 LIVE CONNECTED' : '🔴 DISCONNECTED'}
            </div>
          </div>
        </div>

        {matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ color: '#6b7280', fontSize: '18px' }}>
              No matches available. Matches will appear here when created by admins.
            </div>
          </div>
        ) : (
          <>
            {renderMatchSection('🔥 Live Matches', ongoingMatches)}
            {renderMatchSection('📅 Upcoming Matches', scheduledMatches)}
            {renderMatchSection('✅ Finished Matches', finishedMatches)}
          </>
        )}
      </div>
    </div>
  );
};