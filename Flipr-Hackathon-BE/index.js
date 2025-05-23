// =======================================================
//                      Imports
// =======================================================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import mongoSanitize from 'express-mongo-sanitize';
import { initializeSocket } from './socket/socketHandler.js';

// =======================================================
//              Environment Configuration
// =======================================================
dotenv.config();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOW_ALL_ORIGINS = process.env.ALLOW_ALL_ORIGINS === 'true';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [];


// =======================================================
//                  App Initialization
// =======================================================
const app = express();


// =======================================================
//                  Global Middleware
// =======================================================

app.use(
  cors({
    origin: (origin, callback) => {
      if (ALLOW_ALL_ORIGINS || !origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({useTempFiles:true}));
app.use(mongoSanitize());
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: ALLOW_ALL_ORIGINS ? 'cross-origin' : 'same-origin',
    },
  })
);

app.use(cookieParser());
app.use(compression());



// Environment-Based Middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log('🛠️  Development Mode: Logging enabled via Morgan');
}

if (NODE_ENV === 'production') {
  console.log('🚀 Production Mode: Optimized for performance');
  app.set('trust proxy', 1); // For reverse proxies like Heroku, Nginx
}


// =======================================================
//                        Routes
// =======================================================

// ---------- Health Check ----------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'API is running smoothly.',
    Environment: NODE_ENV,
  });
});

import mainRouter from './routes/mainRouter.js';
app.use('/api', mainRouter);


// =======================================================
//                  Error Handling
// =======================================================

// 404 Route Not Found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    error: '🚷Route not found🚷',
    path: req.originalUrl,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      error: '✋Request blocked: Origin not allowed by CORS policy.',
    });
  }

  res.status(500).json({
    success: false,
    statusCode: 500,
    error: 'Internal Server Error',
    message: err.message,
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});


// =======================================================
//                Database Configuration
// =======================================================
import connectDB from './config/db.js';
connectDB();


// =======================================================
//          Server & Socket.IO Initialization
// =======================================================
const server = http.createServer(app);
const io = new initializeSocket(server, {
  cors: {
    origin: ALLOW_ALL_ORIGINS ? '*' : ALLOWED_ORIGINS,
    credentials: true,
  },
});


// =======================================================
//                   Server Activation
// =======================================================
const startServer = () => {
  server.listen(PORT, HOST, () => {
    console.log(`🚀 [${NODE_ENV.toUpperCase()}] Server running at: http://${HOST}:${PORT}`);
  });
};

if (NODE_ENV !== 'test') startServer();


// =======================================================
//                      Export App
// =======================================================
export default app;
