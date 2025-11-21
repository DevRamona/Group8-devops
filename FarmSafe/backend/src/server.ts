import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import farmerRoutes from './routes/farmers.js';
import authRoutes from './routes/auth.js';
import { connectToDatabase } from './config/db.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// Middleware
// Serve static files from pictures directory using absolute path
const picturesDir = path.resolve(__dirname, 'pictures');
app.use('/pictures', express.static(picturesDir));
app.use(cors());
app.use(express.json());

// Direct route for testing (enabled only in development)
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/farmers/test', (req: express.Request, res: express.Response) => {
    res.json([{ id: 1, name: 'Test Farmer', email: 'test@example.com', createdAt: new Date().toISOString() }]);
  });
}

// Use the farmer routes instead of overriding
app.use('/api/farmers', farmerRoutes);
app.use('/api/auth', authRoutes);


app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'FarmSafe API is running' });
});

// 404 handler for unknown routes
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Centralized error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
async function start() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

export default app;
