// multerConfig.js
import fs from 'fs'; // File system module to interact with the file system
import multer from 'multer'; // Multer library for handling multipart/form-data (file uploads)
import path from 'path'; // Path module to handle file and directory paths

// Define storage settings for multer
const storage = multer.diskStorage({
    // Specify the destination directory for uploaded files
    destination: (req, file, cb) => {
        const uploadDir = './uploads'; // Directory to store uploaded files

        // Check if the directory exists; if not, create it recursively
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the directory structure exists
        }

        cb(null, uploadDir); // Pass the directory path to multer
    },
    // Configure the filename for uploaded files
    filename: (req, file, cb) => {
        // Generate a unique filename by appending a timestamp to the original name
        const timestamp = Date.now(); // Get the current timestamp
        const fileExtension = path.extname(file.originalname); // Extract the file extension
        const uniqueFilename = `${timestamp}-${file.originalname.replace(/\s+/g, '_')}`; // Replace spaces with underscores for safety
        cb(null, uniqueFilename); // Pass the generated filename to multer
    },
});

// Configure multer with storage and additional settings
const upload = multer({
    storage, // Use the custom storage configuration
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size to 5MB
    fileFilter: (req, file, cb) => {
        // Validate the file type by checking its MIME type
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Allowed MIME types
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file if it's an allowed type
        } else {
            cb(new Error('Only image files are allowed!'), false); // Reject the file if it's not an allowed type
        }
    },
});

// Export the upload middleware
export const uploadMiddleware = (fieldName) => {
    // Create and return a single file upload handler for the specified field name
    return upload.single(fieldName);
};
