// index.js
// =======================================================
//                   Imports
// =======================================================
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { Server } from "socket.io";

// Custom modules
import mainRouter from "./routes/mainRouter.js";
import logger from "./configs/logger.config.js";
import SocketServer from "./SocketServer.js";


// =======================================================
//               Environment Configuration
// =======================================================
dotenv.config();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";
const NODE_ENV = process.env.NODE_ENV;
const CLIENT_ENDPOINT = process.env.CLIENT_ENDPOINT;
const DATABASE_URL = process.env.DATABASE_URL;
const ALLOW_ALL_ORIGINS = process.env.ALLOW_ALL_ORIGINS === "true";
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [];


// =======================================================
//                  App Initialization
// =======================================================
const app = express();


// =======================================================
//                  Global Middleware
// =======================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  helmet.crossOriginResourcePolicy({
    policy: ALLOW_ALL_ORIGINS ? "cross-origin" : "same-origin",
  })
);

//app.use(mongoSanitize()); 
app.use(cookieParser()); 
app.use(compression()); 
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (ALLOW_ALL_ORIGINS || !origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Environment-Based Middleware
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("🛠️ Development Mode: Logging enabled via Morgan");
}

if (NODE_ENV === "production") {
  console.log("🚀 Production Mode: Optimized for performance");
  app.set("trust proxy", 1); // For reverse proxies like Heroku, Nginx
}


// =======================================================
//                        Routes
// =======================================================

// ---------- Health Check ----------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "API is running",
    environment: NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.use("/api/v1", mainRouter);


// =======================================================
//                     Error Handling
// =======================================================

// 404 Route Not Found
app.use((req, res, next) => {
  // Using http-errors to create the error object
  next(createHttpError.NotFound("🚷Route not found🚷"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      error: "✋Request blocked: Origin not allowed by CORS policy.",
    });
  }

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    error: message,
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
});


// =======================================================
//                 Database Configuration
// =======================================================
const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    logger.info("✅ Connected to MongoDB");
    if (NODE_ENV === "development") {
      mongoose.set("debug", true);
      logger.info("🛠️ MongoDB Debug Mode Enabled");
    }
  } catch (err) {
    logger.error(`❌ MongoDB connection failed: ${err}`);
    process.exit(1);
  }
};
connectDB();

mongoose.connection.on("error", (err) => {
  logger.error(`❌ MongoDB error: ${err}`);
  process.exit(1);
});


// =======================================================
//                   Server Activation
// =======================================================
let server;
const startServer = () => {
  server = app.listen(PORT, HOST, () => {
    logger.info(
      `🚀 [${
        NODE_ENV ? NODE_ENV.toUpperCase() : "DEVELOPMENT"
      }] Server running at: http://${HOST}:${PORT}`
    );
  });

  // =======================================================
  //                    Socket.IO Setup
  // =======================================================
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: CLIENT_ENDPOINT,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info("🔌 Socket.IO client connected");
    SocketServer(socket, io);
  });
};

if (NODE_ENV !== "test") startServer();


// =======================================================
//                Global Error Handlers
// =======================================================

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("🛑 Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error("💥 Unexpected error:", error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
  logger.info("📴 SIGTERM received");
  if (server) {
    server.close(() => {
      logger.info("🛑 Server closed due to SIGTERM");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});


// =======================================================
//                     Export App
// =======================================================
export default app;
