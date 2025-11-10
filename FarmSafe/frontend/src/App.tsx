import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FarmerProfile from './pages/FarmerProfile';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <div className="logo">
            <h1>FarmSafe</h1>
          </div>
          <div className="layout">
            <main className="main-content" style={{ width: '100%' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
                <Route path="/farmer/:id" element={<Protected><FarmerProfile /></Protected>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
