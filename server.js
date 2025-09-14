import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import mpesaRoutes from './routes/mpesa.js';
import categoryRoutes from './routes/Category.js';
import productRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';
import heroRoutes from './routes/hero.js';
import showcaseRoutes from './routes/showcase.js';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();

const allowedOrigins = [
  'https://ecommerce-electronics-0j4e.onrender.com', // old
  'https://ecommerce-2sgt.onrender.com',
  'https://electromart-2vwj.onrender.com', // new frontend
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true
}));


app.use(express.json());

app.use('/api/products', productRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/uploads', express.static('uploads')); // Serve static images
app.use('/api/orders', ordersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', mpesaRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/showcase', showcaseRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static files from clients/build
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('/test', (req, res) => {
  res.send('Server is working');
});

// Catch-all: Serve React for non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});



// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
