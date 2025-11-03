import { FormEvent, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string })?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  // Right panel uses a solid themed panel without external images

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic validation before attempting login
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    try {
      setLoading(true)
      await login(email.trim(), password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError((err as Error).message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-emerald-900/10 flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left: Form */}
        <div className="p-8 md:p-12 text-left">
          <div className="mb-8">
            <p className="text-sm text-gray-500">Welcome</p>
            <h2 className="text-4xl font-bold tracking-tight">Log In</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Your Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-emerald-600 focus:ring-emerald-600"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 text-left">Password</label>
                <button type="button" className="text-xs text-emerald-700 hover:underline">Forgot password?</button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-emerald-600 focus:ring-emerald-600"
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button type="submit" disabled={loading} className="w-full inline-flex justify-center rounded-lg bg-emerald-700 px-4 py-3 text-white shadow hover:bg-emerald-800 disabled:opacity-60">
              {loading ? 'Signing in…' : 'Log In'}
            </button>
            <p className="text-xs text-gray-500 text-center">Sample: john@example.com / Password123!</p>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-emerald-700 font-medium hover:underline">Sign Up</Link>
            </p>
          </form>
        </div>

        {/* Right: Promo */}
        <div className="relative hidden md:block bg-emerald-800 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.25),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(21,128,61,0.35),transparent_45%)]" />
          <div className="relative h-full p-10 flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-semibold mb-3">Get the best premium food</h3>
            <p className="text-emerald-100 max-w-md">You can get the best premium food with the best price only in HERE!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login


