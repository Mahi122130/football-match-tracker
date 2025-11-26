import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MatchList } from './pages/MatchList';
import { MatchDetail } from './pages/MatchDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MatchList />} />
          <Route path="/match/:matchId" element={<MatchDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;