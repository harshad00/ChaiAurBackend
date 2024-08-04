// Import necessary libraries
import express from 'express'; // Express framework for building web applications
import cors from 'cors';       // Middleware for enabling Cross-Origin Resource Sharing (CORS)
import cookieParser from 'cookie-parser'; // Middleware for parsing cookies

// Create an instance of an Express application
const app = express();

// Middleware settings

// Enable CORS (Cross-Origin Resource Sharing) with specified options
// Allows requests from origins specified in process.env.CORS_ORIGIN
// and supports credentials (such as cookies)
app.use(cors({
    origin: process.env.CORS_ORIGIN, // The allowed origin(s) for CORS requests
    credentials: true // Indicates whether to include credentials in CORS requests
}));

// Middleware to parse incoming JSON requests with a size limit of 16KB
app.use(express.json({ limit: "16kb" }));

// Middleware to parse URL-encoded data (e.g., from forms) with a size limit of 16KB
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to serve static files from the 'public' directory
app.use(express.static("public"));

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Export the Express application instance for use in other modules
export { app };
