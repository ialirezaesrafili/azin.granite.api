import express from "express"; // Import Express.js for handling HTTP requests and responses
import path from "path"; // Path module for handling file and directory paths
import cors from "cors"; // CORS middleware for handling Cross-Origin Resource Sharing
import bodyParser from 'body-parser'; // Body parsing middleware for handling POST request data
import dotenv from "dotenv"; // dotenv for loading environment variables from a .env file
import {fileURLToPath} from "url"; // Utility to handle file URLs in Node.js
import mongooseConnection from "./src/config/mongoose.config.js"; // Function for establishing MongoDB connection
import AppRoutes from './app.router.js'; // Importing application routes for API endpoints
import cookieParser from "cookie-parser"; // Middleware for parsing cookies

// CONFIG ENVIRONMENT
dotenv.config(); // Load environment variables from .env file

// Determine the filename and directory name for handling static assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Application setup
async function application() {
    const uri = process.env.MONGO; // MongoDB URI from environment variables
    const PORT = process.env.PORT || 5000; // Set the port, defaulting to 5000 if not provided

    try {
        const app = express(); // Create an instance of an Express application

        // Middlewares setup
        app.use(cors()); // Enable CORS for all incoming requests (to allow cross-origin requests)
        app.use(express.json()); // Middleware to parse incoming JSON request bodies
        app.use(cookieParser()); // Middleware to parse cookies sent with requests
        app.use(express.urlencoded({extended: false})); // Middleware for parsing URL-encoded form data
        app.use(bodyParser.json()); // Middleware for parsing JSON request bodies (alternative to express.json())
        app.use(bodyParser.urlencoded({extended: false})); // Middleware for parsing URL-encoded data (alternative to express.urlencoded())

        // Serve static files (e.g., images, documents) from the 'public' directory
        app.use("/uploads", express.static(path.join(__dirname, "uploads")));

        // MongoDB Connection
        await mongooseConnection(uri); // Call the mongooseConnection function to connect to MongoDB

        // Application Routes Setup
        app.use('/api', AppRoutes); // Define routes for API under '/api' path

        // Root route handler for a simple welcome page
        app.get('/', (req, res) => {
            res.send('Welcome page'); // Send a welcome message on the root route
        });

        // Start the Express server and listen on the specified port
        app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`); // Log server startup message
        });
    } catch (err) {
        console.error('Failed to start the application:', err.message); // Log any error that occurs during application startup
        process.exit(1); // Exit the process with a failure code if an error occurs
    }
}

// Initialize the application
application(); // Call the application function to start the server
