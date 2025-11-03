const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

// In-memory user store for demo. Replace with DB in production.
const users = []

// Seed demo users for quick testing
;(async () => {
  const seed = [
    { firstname: 'John', lastname: 'Doe', email: 'john@example.com', password: 'Password123!' },
    { firstname: 'Jane', lastname: 'Smith', email: 'jane@example.com', password: 'Password123!' },
  ]
  for (const u of seed) {
    const exists = users.some((x) => x.email.toLowerCase() === u.email.toLowerCase())
    if (!exists) {
      const hash = await bcrypt.hash(u.password, 10)
      users.push({ id: String(Date.now() + Math.random()), firstname: u.firstname, lastname: u.lastname, email: u.email, passwordHash: hash })
    }
  }
})()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const TOKEN_EXPIRY = '1h'

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

router.post('/register', async (req, res) => {
  const { firstname, lastname, email, password } = req.body || {}
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const exists = users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())
  if (exists) return res.status(409).json({ error: 'User already exists' })

  const hash = await bcrypt.hash(password, 10)
  const user = { id: String(Date.now()), firstname, lastname, email, passwordHash: hash }
  users.push(user)

  const token = generateToken({ id: user.id, email: user.email })
  return res.status(201).json({
    user: { id: user.id, firstname, lastname, email },
    token,
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const user = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())
  if (!user) return res.status(401).json({ error: 'Invalid email or password' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' })

  const token = generateToken({ id: user.id, email: user.email })
  return res.json({ user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email }, token })
})

router.get('/me', authMiddleware, (req, res) => {
  const user = users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'Not found' })
  return res.json({ user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email } })
})

router.post('/logout', (_req, res) => {
  // Stateless JWT: client should discard token; no server action needed
  return res.json({ ok: true })
})

module.exports = router


