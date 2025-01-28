import mongoose from 'mongoose'; // Mongoose library for interacting with MongoDB

// Function to establish a connection to MongoDB
async function mongooseConnection(uri) {
    try {
        // Attempt to connect to the MongoDB database using the provided URI
        await mongoose.connect(uri);
        console.log('MongoDB Connected!'); // Log a success message if the connection is established
    } catch (error) {
        // Handle connection errors
        console.log(`[Error] mongoose connection error: ${error.message}`); // Log the error message
        process.exit(1); // Exit the process with a failure code (1) to indicate the error
    }
}

// Export the function to allow its use in other parts of the application
export default mongooseConnection;
