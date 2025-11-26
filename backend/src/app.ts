import express from 'express';
import cors from 'cors';
import matchRoutes from './routes/matchRoutes';
import sseRoutes from './routes/sseRoutes';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', matchRoutes);
app.use('/api', sseRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Add this root route to handle the "Cannot GET" error
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Football Match Tracker API</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
        }
        .container {
          background: rgba(255,255,255,0.1);
          padding: 30px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }
        h1 { text-align: center; margin-bottom: 30px; }
        .endpoint { 
          background: rgba(255,255,255,0.2); 
          padding: 15px; 
          margin: 15px 0; 
          border-radius: 8px;
          border-left: 4px solid #00ff88;
        }
        .frontend-link {
          display: block;
          text-align: center;
          background: #00ff88;
          color: #333;
          padding: 15px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          margin: 20px 0;
          transition: transform 0.2s;
        }
        .frontend-link:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>⚽ Football Match Tracker API</h1>
        <p style="text-align: center; font-size: 18px;">Backend server is running successfully! 🚀</p>
        
        <a href="http://localhost:3000" class="frontend-link">
          🎮 Go to Frontend Application →
        </a>
        
        <h2>📡 Available API Endpoints:</h2>
        
        <div class="endpoint">
          <strong>GET /health</strong> - Health check
        </div>
        
        <div class="endpoint">
          <strong>GET /api/matches</strong> - Get all matches
        </div>
        
        <div class="endpoint">
          <strong>POST /api/matches</strong> - Create a match<br>
          <em>Body: {"teamA": "Team A", "teamB": "Team B"}</em>
        </div>
        
        <div class="endpoint">
          <strong>POST /api/matches/:id/start</strong> - Start a match
        </div>
        
        <div class="endpoint">
          <strong>POST /api/matches/:id/goal</strong> - Add a goal<br>
          <em>Body: {"team": "A", "player": "Player Name"}</em>
        </div>
        
        <div class="endpoint">
          <strong>POST /api/matches/:id/card</strong> - Add a card<br>
          <em>Body: {"team": "A", "player": "Player Name", "cardType": "yellow_card"}</em>
        </div>
        
        <div class="endpoint">
          <strong>GET /api/matches-stream</strong> - Real-time match list (SSE)
        </div>
        
        <div class="endpoint">
          <strong>GET /api/matches/:id/stream</strong> - Real-time match events (SSE)
        </div>
        
        <div style="text-align: center; margin-top: 30px; opacity: 0.8;">
          <p>🎯 Your real-time football tracking system is ready!</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Handle undefined routes
app.get('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: 'Check the root route (/) for available endpoints',
    availableRoutes: [
      'GET /health',
      'GET /api/matches',
      'POST /api/matches',
      'POST /api/matches/:id/start', 
      'POST /api/matches/:id/goal',
      'POST /api/matches/:id/card',
      'GET /api/matches-stream',
      'GET /api/matches/:id/stream'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Football Match Tracker Server running at http://localhost:${PORT}`);
  console.log(`📡 SSE endpoints available at /api/matches-stream and /api/matches/:id/stream`);
});