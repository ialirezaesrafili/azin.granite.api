import jwt from 'jsonwebtoken';
import httpStatusCodes from 'http-status-codes';
import dotenv from "dotenv";

dotenv.config();
const protectRoute = (req, res, next) => {
    // 1. Get the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>'

    // 2. If token is not present, return Unauthorized error
    if (!token) {
        return res.status(httpStatusCodes.UNAUTHORIZED).json({
            message: 'No token provided, authorization denied.',
        });
    }

    try {
        // 3. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use your secret key

        // 4. Save the decoded user data (like user ID) in the request object
        req.user = decoded;

        // 5. Call the next middleware or controller
        next();
    } catch (error) {
        // 6. If token is invalid, return Unauthorized error
        return res.status(httpStatusCodes.UNAUTHORIZED).json({
            message: 'Invalid token, authorization denied.',
        });
    }
};

export default protectRoute;
