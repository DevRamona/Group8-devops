import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FaUser, FaCloudSun, FaChartLine } from 'react-icons/fa';
import FarmerList from './components/FarmerList';
import FarmerProfile from './pages/FarmerProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="logo">
          <h1>FarmSafe</h1>
        </div>
        <div className="layout">
          <nav className="sidebar">
            <ul>
              <li>
                <FaUser />
                <span>Profile</span>
              </li>
              <li>
                <FaCloudSun />
                <span>Seasonal Weather</span>
              </li>
              <li>
                <FaChartLine />
                <span>Crop Price Tracker</span>
              </li>
            </ul>
          </nav>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<FarmerList />} />
              <Route path="/farmer/:id" element={<FarmerProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
