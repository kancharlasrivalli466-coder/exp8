const express = require("express");
const app = express();
const PORT = 3000;

// Parse incoming JSON data
app.use(express.json());node

// ------------------------------------
// 1. CUSTOM SECURITY HEADERS MIDDLEWARE
// ------------------------------------
function securityHeaders(req, res, next) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Content-Security-Policy", "default-src 'self'");

    console.log("Security headers added");
    next();
}

// ------------------------------------
// 2. CUSTOM AUTHENTICATION MIDDLEWARE
// ------------------------------------
function authenticate(req, res, next) {
    const { username, password } = req.body;

    // Demo credentials
    const validUsername = "student1";
    const validPassword = "Hello123";

    if (username === validUsername &&
        password === validPassword) {

        console.log("Authentication successful");
        next();
    } else {
        const error = new Error("Invalid username or password");
        error.status = 401;
        next(error);
    }
}

// ------------------------------------
// 3. HOME ROUTE
// ------------------------------------
app.get("/", (req, res) => {
    res.send("Express Custom Middleware Application");
});

// ------------------------------------
// 4. PUBLIC ROUTE
// ------------------------------------
app.get("/public", (req, res) => {
    res.json({
        message: "This is a public page. Login is not required."
    });
});

// ------------------------------------
// 5. PROTECTED ROUTE
// ------------------------------------
app.post("/protected", authenticate, (req, res) => {
    res.json({
        message: "Login successful! Welcome, student1.",
        data: "You can access protected content."
    });
});

// ------------------------------------
// 6. HANDLE UNKNOWN ROUTES
// ------------------------------------
app.use((req, res, next) => {
    const error = new Error("Page not found");
    error.status = 404;
    next(error);
});

// ------------------------------------
// 7. CUSTOM ERROR LOGGING MIDDLEWARE
// ------------------------------------
function errorLogger(err, req, res, next) {
    const status = err.status || 500;

    // Log error details in the terminal
    console.error(
        `[${new Date().toISOString()}]`,
        `Method: ${req.method}`,
        `URL: ${req.originalUrl}`,
        `Status: ${status}`,
        `Error: ${err.message}`
    );

    // Send an appropriate response
    res.status(status).json({
        success: false,
        message: status === 500
            ? "Internal server error"
            : err.message
    });
}

// Error-handling middleware must be registered last
app.use(errorLogger);

// ------------------------------------
// 8. START SERVER
// ------------------------------------
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
