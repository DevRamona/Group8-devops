import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const Signup = () => {
  const { register } = useAuth() as any
  const navigate = useNavigate()

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      setLoading(true)
      await register({ firstname, lastname, email: email.trim(), password })
      navigate('/')
    } catch (err) {
      setError((err as Error).message || 'Signup failed')
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
            <h2 className="text-4xl font-bold tracking-tight">Create your account</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input
                  className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-emerald-600 focus:ring-emerald-600"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input
                  className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-emerald-600 focus:ring-emerald-600"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  placeholder="Last name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-emerald-600 focus:ring-emerald-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 focus:border-emerald-600 focus:ring-emerald-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center rounded-lg bg-emerald-700 px-4 py-3 text-white shadow hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? 'Creating…' : 'Create account'}
            </button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-emerald-700 font-medium hover:underline">Log In</a>
            </p>
          </form>
        </div>
        {/* Right: Promo */}
        <div className="relative hidden md:block bg-emerald-800 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.25),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(21,128,61,0.35),transparent_45%)]" />
          <div className="relative h-full p-10 flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-semibold mb-3">Join our farmer community</h3>
            <p className="text-emerald-100 max-w-md">Create your AgriConnect account and start connecting with experts, tracking your farm's growth, and accessing premium services.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup



