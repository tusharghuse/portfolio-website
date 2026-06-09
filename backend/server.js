/* ============================================================
   server.js — Main Express Server Entry Point
   Tushar Ghuse Portfolio Backend
   ============================================================ */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');

// Routes (create these next)
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

/* ============================================================
   DATABASE CONNECTION
   ============================================================ */

connectDB();

/* ============================================================
   SECURITY MIDDLEWARE
   ============================================================ */

app.use(helmet());

app.use(
    mongoSanitize({
        replaceWith: '_'
    })
);

/* ============================================================
   RATE LIMITING
   ============================================================ */

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many requests. Please try again later.'
    }
});

app.use('/api', limiter);

/* ============================================================
   CORS
   ============================================================ */

app.use(cors());

/* ============================================================
   BODY PARSING
   ============================================================ */

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

/* ============================================================
   LOGGING
   ============================================================ */

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

/* ============================================================
   HEALTH CHECK
   ============================================================ */

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Tushar Portfolio API Running',
        version: '1.0.0'
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

/* ============================================================
   API ROUTES
   ============================================================ */

// Public project routes
app.use('/api/projects', projectRoutes);

// Contact form routes
app.use('/api/contact', contactRoutes);

/* ============================================================
   404 HANDLER
   ============================================================ */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

/* ============================================================
   GLOBAL ERROR HANDLER
   ============================================================ */

app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);

    res.status(err.status || 500).json({
        success: false,
        error:
            process.env.NODE_ENV === 'production'
                ? 'Internal Server Error'
                : err.message
    });
});

/* ============================================================
   START SERVER
   ============================================================ */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(
        `🚀 Portfolio API running on http://localhost:${PORT}`
    );
});

/* ============================================================
   GRACEFUL SHUTDOWN
   ============================================================ */

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});