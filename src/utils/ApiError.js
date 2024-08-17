// Define a custom error class ApiError that extends the built-in Error class
class ApiError extends Error {
  // The constructor function is called when a new instance of ApiError is created
  constructor(
    statusCode, // The HTTP status code associated with the error
    message = "Something went wrong", // The error message, defaulting to "Something went wrong"
    errors = [], // An optional array to hold additional error details
    stack = "" // An optional string to hold the stack trace, defaulting to an empty string
  ) {
    // Call the parent class (Error) constructor with the error message
    super(message);

    // Initialize custom properties
    this.statusCode = statusCode; // Set the HTTP status code
    this.data = null; // Initialize data to null (can be used to store additional information)
    this.message = message; // Incorrectly named property; should be `this.message`
    this.success = false; // A Boolean indicating that the operation was not successful
    this.errors = errors; // Store additional error details

    // Check if a stack trace was provided
    if (stack) {
      this.stack = stack; // Set the stack trace if provided
    } else {
      // Otherwise, capture the stack trace using Error.captureStackTrace
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Export the ApiError class for use in other modules
export { ApiError };
