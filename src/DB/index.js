// Import the mongoose library for MongoDB interactions
import mongoose from "mongoose";
// Import the database name constant from a separate module
import { DB_NAME } from "../constants.js";

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the mongoose.connect method
    // Construct the MongoDB connection string using an environment variable and the imported DB_NAME
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    
    // Log a success message including the host of the MongoDB server
    console.log(
      `\n MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    // If an error occurs during the connection process, log the error message
    console.log("MONGODB CONNECTION ERROR:", error);
    // Exit the process with a status code of 1 to indicate an error occurred
    process.exit(1);
  }
};

// Export the connectDB function as the default export of the module
export default connectDB;
