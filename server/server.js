import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_builder';

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  res.json({
    status: 'online',
    database: states[dbState] || 'Unknown',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    sheetsConfigured: !!(process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 4000
}).then(() => {
  console.log(` Connected to MongoDB at: ${MONGODB_URI}`);
}).catch((err) => {
  console.warn(` MongoDB Connection Warning: ${err.message}`);
  console.log(' App will run with resilient memory/sample fallback if MongoDB is not running yet.');
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` ProFolio AI Backend Server running on http://localhost:${PORT}`);
  console.log(` Gemini API Key status: ${process.env.GEMINI_API_KEY ? ' Configured' : ' Missing (fallback heuristics active)'}`);
  console.log(`=======================================================`);
});
