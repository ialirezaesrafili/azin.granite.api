import jwt from 'jsonwebtoken'; // Library for creating and verifying JSON Web Tokens
import dotenv from 'dotenv'; // Library to load environment variables from .env file
import authModel from "../auth/auth.model.js"; // Importing the auth model to interact with the database for user authentication

dotenv.config(); // Load environment variables from .env file

/**
 * Middleware to authenticate a user based on a JWT token.
 *
 * This middleware verifies the JWT token sent in the `Authorization` header.
 * If the token is valid, the user's details are retrieved and attached to `req.user`.
 * If invalid, a 401 Unauthorized response is returned.
 */
const authenticate = async (req, res, next) => {
    // Extract the token from the Authorization header (e.g., "Bearer <token>")
    const token = req.header('Authorization')?.split(' ')[1];

    // If no token is provided, return an Unauthorized response
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }

    try {
        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if the user exists in the database and if the token is valid
        const user = await authModel.findOne({
            _id: decoded.userId, // Match user ID from the token
            token // Ensure the token matches the one stored in the database
        });

        // If no user is found or the user is not logged in, return an Unauthorized response
        if (!user || !user.isLoggedIn) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        // Attach the authenticated user to the `req.user` object for downstream use
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Log the error and return an Unauthorized response
        console.error(`[Auth Middleware] Error verifying token: ${error.message}`);
        return res.status(401).json({ message: 'Unauthorized access.' });
    }
};

export default authenticate; // Export the middleware for use in routes
