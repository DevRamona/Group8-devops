import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import farmerRoutes from './routes/farmers.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Direct route for testing
app.get('/api/farmers/test', (req: express.Request, res: express.Response) => {
  res.json([{ id: 1, name: 'Test Farmer', email: 'test@example.com', createdAt: new Date().toISOString() }]);
});

// Use the farmer routes instead of overriding
app.use('/api/farmers', farmerRoutes);


app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'FarmSafe API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
