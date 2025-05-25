// server.js

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
import routes from "./routes/index.js";
import logger from "./configs/logger.config.js";
import SocketServer from "./SocketServer.js";

// =============================
// Load .env Variables
// =============================
dotenv.config();
const { DATABASE_URL, PORT = 8000, CLIENT_ENDPOINT, NODE_ENV } = process.env;

// =============================
// Initialize Express App
// =============================
const app = express();

// =============================
// Middleware
// =============================

if (NODE_ENV !== "production") {
  app.use(morgan("dev")); // HTTP request logger
}

app.use(helmet()); // Security headers
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser
//app.use(mongoSanitize()); // Prevent NoSQL injection
//app.use(cookieParser()); // Parse cookies
//app.use(compression()); // Compress response bodies
/*app.use(
  fileUpload({
    useTempFiles: true,
  })
);
*/
// Enable CORS
app.use(
  cors({
    origin: CLIENT_ENDPOINT,
    credentials: true,
  })
);

// =============================
// Routes
// =============================
app.use("/api/v1", routes);

// =============================
// Error Handling
// =============================

// 404 Handler
app.use((req, res, next) => {
  next(createHttpError.NotFound("This route does not exist"));
});

// General Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// =============================
// MongoDB Connection
// =============================

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("✅ Connected to MongoDB"))
  .catch((err) => {
    logger.error(`❌ MongoDB connection failed: ${err}`);
    process.exit(1);
  });

mongoose.connection.on("error", (err) => {
  logger.error(`❌ MongoDB error: ${err}`);
  process.exit(1);
});

if (NODE_ENV !== "production") {
  mongoose.set("debug", true);
  logger.info("🛠️ MongoDB Debug Mode Enabled");
}

// =============================
// Start HTTP Server
// =============================
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
});

// =============================
// Socket.IO Setup
// =============================
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

// =============================
// Global Error Handlers
// =============================

const exitHandler = () => {
  if (server) {
    logger.info("🛑 Server closed");
  }
  process.exit(1);
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
    logger.info("🛑 Server closed due to SIGTERM");
  }
  process.exit(0);
});
