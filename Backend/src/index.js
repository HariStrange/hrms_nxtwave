const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(".", "env") });

const { testConnection, createTables } = require("./db");
const errorHandler = require("./middlewares/errorHandler");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const teamRoutes = require("./routes/teamRoutes");
const logRoutes = require("./routes/logRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HRMS API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/logs", logRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error(
        "Failed to connect to database. Please check your configuration."
      );
      process.exit(1);
    }

    await createTables();

    app.listen(PORT, () => {
      console.log(`\n${"=".repeat(50)}`);
      console.log(`HRMS Backend Server`);
      console.log(`${"=".repeat(50)}`);
      console.log(`Server running on port: ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`${"=".repeat(50)}\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  process.exit(0);
});
