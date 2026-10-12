// Load the Express library so we can create a web server.
const express = require("express");

// Create the Express application. "app" is our server.
const app = express();

// The port the server listens on.
const PORT = 5000;

// Middleware: lets the server read JSON sent in request bodies.
// We don't need it for the health check, but every API route we add later will.
app.use(express.json());

// Health check route: GET http://localhost:5000/api/health
// Used to confirm the server is up and responding.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});

// 404 handler: runs only when no route above matched the request.
// It must come AFTER all the routes, because Express checks them in order.
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler: Express recognises it by its four arguments (err, req, res, next).
// It catches errors thrown inside routes, and bad JSON sent in a request body.
app.use((err, req, res, next) => {
  console.error(err);

  // Use the error's own status code if it has one (e.g. 400 for bad JSON), otherwise 500.
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    status: "error",
    message: statusCode === 500 ? "Something went wrong on the server" : err.message,
  });
});

// Start the server and wait for incoming requests.
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
