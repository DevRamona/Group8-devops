require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')

const app = express()

// CORS: allow one or more comma-separated origins via FRONTEND_ORIGIN
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
const allowedOrigins = FRONTEND_ORIGIN.split(',').map((o) => o.trim())
console.log('[CORS] Allowed origins:', allowedOrigins)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true) // allow non-browser or same-origin
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
)

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})


