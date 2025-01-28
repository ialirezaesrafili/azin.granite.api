import autoBind from 'auto-bind'; // Import auto-bind to automatically bind class methods to the class instance
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing and comparison
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for generating JWT tokens
import authModel from './auth.model.js'; // Import the user model to interact with the database
import dotenv from 'dotenv'; // Import dotenv to manage environment variables

dotenv.config(); // Load environment variables from .env file

class AuthService {
    #userModel; // Private variable to store the user model

    constructor() {
        autoBind(this); // Automatically bind all methods to the class instance
        this.#userModel = authModel; // Assign the auth model to the private variable
    }

    // Method to create a new user
    async createUser(email, username = null, password, userData) {
        // Check if a user with the given email already exists
        const existingUser = await this.#userModel.findOne({email});
        if (existingUser) throw new Error(`User with email ${email} already exists`);

        // Hash the password using bcrypt with a salt round defined in the environment variable
        const saltRounds = parseInt(process.env.SALT, 10) || 10; // Default salt rounds to 10 if not defined in .env
        const passwordHashed = await bcrypt.hash(password, saltRounds);

        // Set default username to email if not provided
        const usernameDefault = username ? username : email;

        // Create a new user in the database
        const newUser = await this.#userModel.create({
            email,
            password: passwordHashed,
            username: usernameDefault,
            ...userData, // Spread any additional user data
        });

        return newUser; // Return the newly created user
    }

    // Method to log in a user
    async loginUser(email, password) {
        // Find the user by email
        const user = await this.#userModel.findOne({email});
        if (!user) throw new Error('Invalid credentials'); // If user not found, throw error

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('Invalid credentials'); // If passwords don't match, throw error

        // Generate a JWT token for the user
        const token = this.signToken({userId: user._id, email: user.email});

        // Assign the token and logged-in status to the user and save
        user.token = token;
        user.isLoggedIn = true;
        await user.save();

        return {user, token}; // Return user and token
    }

    // Method to log out a user
    async logoutUser(token) {
        // Find the user by token (check if token is still valid)
        const user = await this.#userModel.findOne({token});
        if (!user) throw new Error('User not found or token is invalid'); // If user not found, throw error

        // Clear the token and logged-in status from the user
        user.token = '';
        user.isLoggedIn = false;
        await user.save();

        return user; // Return the user after logging out
    }

    async whoAmi(token) {
        try {
            const checkUser = await this.#userModel.findOne({token: token});
            if (!checkUser) throw new Error('User not found or token is invalid');
            return checkUser;
        } catch (error) {
            console.error(error.message);
        }
    } // Method to sign a JWT token
    signToken(payload) {
        // Check if the JWT secret key is defined
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT secret key is not defined');
        }
        // Generate and return a JWT token with a 7-day expiration
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});
    }
}

// Create an instance of the AuthService class
const authService = new AuthService();
export default authService; // Export the instance to be used in other parts of the application
