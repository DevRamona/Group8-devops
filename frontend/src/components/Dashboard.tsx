import { useAuth } from '../hooks/useAuth'

export const Dashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div style={{ maxWidth: 720, margin: '4rem auto' }}>
      <h2>Welcome, {user?.firstname} {user?.lastname}</h2>
      <p>You are now logged in to AgriConnect.</p>
      <div style={{ marginTop: 24 }}>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}

export default Dashboard



