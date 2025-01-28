import {Router} from 'express'; // Import the Router from Express to define routes
import authController from './auth.controller.js';
import authenticate from "../middleware/auth.middleware.js"; // Import the AuthController to handle authentication-related requests

const router = Router(); // Create a new instance of the Router

// Define a route for user registration
router.post('/register', authController.createUser);
// When a POST request is made to '/register', the createUser method in the authController will handle it

// Define a route for user login
router.post('/login', authController.loginUser);
// When a POST request is made to '/login', the loginUser method in the authController will handle it

// Define a route for user logout
router.post('/logout', authController.logoutUser);
// When a POST request is made to '/logout', the logoutUser method in the authController will handle it

router.get('/look-up', authenticate, authController.whoAmi);

export default router; // Export the router instance to be used in other parts of the application
