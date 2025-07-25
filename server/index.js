import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import path from 'path';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Serve static files from uploads before routes
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/complaints', complaintRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`Server running in ${ENV} mode on port ${PORT}`);
});
