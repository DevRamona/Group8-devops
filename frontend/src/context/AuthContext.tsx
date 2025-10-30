import { createContext, useCallback, useEffect, useMemo, useState, ReactNode } from 'react'

type AuthUser = {
  id: string
  firstname: string
  lastname: string
  email: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register?: (input: { firstname: string; lastname: string; email: string; password: string }) => Promise<void>
}

const STORAGE_KEY = 'agriConnectUser'
const TOKEN_KEY = 'agriConnectToken'
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000'

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const savedToken = localStorage.getItem(TOKEN_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as AuthUser
        setUser(parsed)
      }
      if (savedToken) setToken(savedToken)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Login failed')
      }
      const data = await res.json()
      const authUser: AuthUser = data.user
      const authToken: string = data.token
      setUser(authUser)
      setToken(authToken)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
      localStorage.setItem(TOKEN_KEY, authToken)
    } catch (err) {
      // Provide a friendlier message for network/CORS errors
      if (err instanceof TypeError) {
        throw new Error('Cannot reach the server. Check that the API is running and CORS is configured.')
      }
      throw err as Error
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }, [])

  const register = useCallback(async (input: { firstname: string; lastname: string; email: string; password: string }) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Registration failed')
    }
    const data = await res.json()
    const authUser: AuthUser = data.user
    const authToken: string = data.token
    setUser(authUser)
    setToken(authToken)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    localStorage.setItem(TOKEN_KEY, authToken)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, login, logout, register }),
    [user, login, logout, register]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


