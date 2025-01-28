import autoBind from 'auto-bind'; // Automatically bind class methods to the instance, avoiding manual binding
import authService from './auth.service.js'; // Import the authService to handle the actual business logic
import httpStatusCodes from 'http-status-codes'; // Import HTTP status codes for consistent response handling
import dotenv from 'dotenv'; // Import dotenv to manage environment variables

dotenv.config(); // Initialize environment variables from the .env file

// AuthController class handles user authentication and related operations
class AuthController {
    #userService; // Private field to store the user service instance

    // Constructor accepts a userService to handle business logic, defaults to authService if no service is provided
    constructor(userService = authService) {
        autoBind(this); // Automatically bind methods to the instance
        this.#userService = userService; // Set the user service
    }

    // Method to create a new user
    async createUser(req, res, next) {
        try {
            const {email, password, username, ...userData} = req.body; // Destructure the incoming request body

            // Check if email and password are provided
            if (!email || !password) {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: 'Email and password are required.', // Respond with error if required fields are missing
                });
            }

            // Call the user service to create the user
            const user = await this.#userService.createUser(email, username, password, userData);

            // If the user already exists, return a conflict error
            if (!user) {
                return res.status(httpStatusCodes.CONFLICT).json({
                    message: 'User already exists', // Respond with error if user already exists
                });
            }

            // Respond with success message and the created user data
            return res.status(httpStatusCodes.CREATED).json({
                message: 'User created successfully',
                data: user,
            });
        } catch (error) {
            // Handle any errors that occur during user creation
            console.error(`[AuthController] Error creating user: ${error.message}`);
            next(error); // Pass the error to the next middleware for handling
        }
    }

    // Method to log in a user
    async loginUser(req, res, next) {
        try {
            const {email, password} = req.body; // Extract email and password from the request body

            // Check if both email and password are provided
            if (!email || !password) {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: 'Email and password are required.', // Respond with error if fields are missing
                });
            }

            // Call the user service to log in the user
            const {user, token} = await this.#userService.loginUser(email, password);

            // Set the authentication token in the response header for the client
            res.setHeader('Authorization', `Bearer ${token}`);

            // Respond with success message and user data
            return res.status(httpStatusCodes.OK).json({
                message: 'User logged in successfully',
                data: user,
            });
        } catch (error) {
            // Handle any errors that occur during login
            console.error(`[AuthController] Error logging in user: ${error.message}`);
            next(error); // Pass the error to the next middleware for handling
        }
    }

    // Method to log out a user
    async logoutUser(req, res, next) {
        try {
            // Extract the token from the Authorization header
            const token = req.header('Authorization')?.split(' ')[1];

            // If no token is provided, return an error
            if (!token) {
                return res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: 'Token is required to log out.', // Respond with error if token is missing
                });
            }

            // Call the user service to handle logout
            const user = await this.#userService.logoutUser(token);

            // Respond with success message after logging out
            return res.status(httpStatusCodes.OK).json({
                message: 'User logged out successfully',
                data: user,
            });
        } catch (error) {
            // Handle any errors that occur during logout
            console.error(`[AuthController] Error logging out user: ${error.message}`);
            next(error); // Pass the error to the next middleware for handling
        }
    }

    async whoAmi(req, res, next) {
        try {


            const token = req.header('Authorization')?.split(' ')[1];
            const user = await this.#userService.whoAmi(token);
            if (!user) {
                return res.status(httpStatusCodes.UNAUTHORIZED).json(
                    {message: "UNAUTHORIZED"}
                )
            }

            return res.status(httpStatusCodes.OK).json({
                message: "DETAIL OF USER",
                data: {
                    name: user.name,
                    lastname: user.lastname,
                    role: user.role,
                    email: user.email
                }
            })
        } catch (error) {
            next(error);
        }
    }
}

// Create an instance of the AuthController class
const authController = new AuthController();
export default authController; // Export the controller to be used in the routes
