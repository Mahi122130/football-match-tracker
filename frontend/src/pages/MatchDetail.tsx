import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Match, MatchEvent, SSEMessage } from '../types';

export const MatchDetail: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<MatchEvent[]>([]);

  useEffect(() => {
    if (!matchId) return;

    const eventSource = new EventSource(`http://localhost:8080/api/matches/${matchId}/stream`);

    eventSource.onopen = () => {
      setConnected(true);
      console.log('SSE Connected for match details');
    };

    eventSource.onmessage = (event) => {
      try {
        const message: SSEMessage = JSON.parse(event.data);
        
        switch (message.type) {
          case 'match_data':
            setMatch(message.data);
            setEvents(message.data.events || []);
            break;
          case 'goal':
          case 'yellow_card':
          case 'red_card':
          case 'foul':
            setEvents(prev => [...prev, message.data]);
            break;
          case 'match_started':
            setMatch(message.data);
            break;
          default:
            console.log('Unknown message type:', message.type);
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
  }, [matchId]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow_card': return '🟨';
      case 'red_card': return '🟥';
      case 'foul': return '⚠️';
      default: return '🔔';
    }
  };

  const getEventStyle = (type: string) => {
    switch (type) {
      case 'goal': return { background: '#dcfce7', border: '#22c55e' };
      case 'yellow_card': return { background: '#fef9c3', border: '#eab308' };
      case 'red_card': return { background: '#fee2e2', border: '#ef4444' };
      case 'foul': return { background: '#ffedd5', border: '#f97316' };
      default: return { background: '#f3f4f6', border: '#6b7280' };
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ongoing': return { background: '#dcfce7', color: '#166534' };
      case 'scheduled': return { background: '#dbeafe', color: '#1e40af' };
      case 'finished': return { background: '#f3f4f6', color: '#374151' };
      default: return { background: '#f3f4f6', color: '#374151' };
    }
  };

  if (!match) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#6b7280', fontSize: '18px' }}>Loading match details...</div>
          <a 
            href="/" 
            style={{ 
              color: '#3b82f6', 
              textDecoration: 'none', 
              marginTop: '16px', 
              display: 'inline-block',
              fontWeight: 'bold'
            }}
          >
            ← Back to matches
          </a>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusStyle(match.status);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px 0' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <a 
            href="/" 
            style={{ 
              color: '#3b82f6', 
              textDecoration: 'none', 
              fontWeight: 'bold', 
              display: 'flex', 
              alignItems: 'center' 
            }}
          >
            ← Back to matches
          </a>
          
          <div style={{
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: connected ? '#dcfce7' : '#fee2e2',
            color: connected ? '#166534' : '#dc2626'
          }}>
            {connected ? '🔵 LIVE UPDATES' : '🔴 DISCONNECTED'}
          </div>
        </div>

        {/* Match Header */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '32px', 
          marginBottom: '32px', 
          textAlign: 'center', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
        }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: statusStyle.background,
              color: statusStyle.color
            }}>
              {match.status === 'ongoing' ? 'LIVE' : 
               match.status === 'scheduled' ? 'UPCOMING' : 'FINISHED'}
            </span>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            maxWidth: '32rem', 
            margin: '0 auto' 
          }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{match.teamA}</h2>
            </div>
            
            <div style={{ margin: '0 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '60px', fontWeight: 'bold', color: '#111827' }}>
                {match.scoreA} - {match.scoreB}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>Current Score</div>
            </div>
            
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{match.teamB}</h2>
            </div>
          </div>

          {match.startTime && (
            <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
              Started: {new Date(match.startTime).toLocaleString()}
            </div>
          )}
        </div>

        {/* Events Timeline */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
            📋 Match Events
          </h3>
          
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
              No events yet. Events will appear here as they happen.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {events
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((event) => {
                  const eventStyle = getEventStyle(event.type);
                  return (
                    <div
                      key={event.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${eventStyle.border}`,
                        backgroundColor: eventStyle.background
                      }}
                    >
                      <div style={{ fontSize: '24px', marginRight: '16px' }}>{getEventIcon(event.type)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#111827' }}>
                          {event.description}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                          {event.team === 'A' ? match.teamA : match.teamB} • 
                          Minute {event.minute} • 
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};