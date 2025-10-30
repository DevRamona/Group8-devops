import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import Dashboard from './components/Dashboard'
import Signup from './components/Signup'

function App() {
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoute />}> 
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App
