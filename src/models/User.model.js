import mongoose, {Schema} from "mongoose"; // Import Mongoose and Schema for defining and interacting with the database schema
import jwt from "jsonwebtoken"; // Import jsonwebtoken for generating JWT tokens
import bcrypt from "bcrypt"; // Import bcrypt for hashing and comparing passwords

const userSchema = new Schema({
    userName:{
        type: 'String', // Define the type of the field as String
        required: true, // This field is required
        unique: true, // This field must be unique in the database
        lowercase: true, // Convert the value to lowercase before saving
        trim: true, // Remove any leading or trailing whitespace
        index: true, // Create an index for this field to improve search performance
    },
    
    email:{
        type: 'String', // Define the type of the field as String
        required: true, // This field is required
        unique: true, // This field must be unique in the database
        lowercase: true, // Convert the value to lowercase before saving
        trim: true, // Remove any leading or trailing whitespace
    },
    fullName:{
        type: 'String', // Define the type of the field as String
        required: true, // This field is required
        trim: true, // Remove any leading or trailing whitespace
        index: true, // Create an index for this field to improve search performance
    },
    avatar:{
        type: 'String', // Define the type of the field as String (typically a URL from Cloudinary)
        required: true, // This field is required
    },
    coverimage:{
        type: 'String', // Define the type of the field as String (typically a URL from Cloudinary)
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId, // Define the type of the field as ObjectId
            ref: "Video" // Reference the Video model for populating this field
        }
    ],
    password:{
        type: 'String', // Define the type of the field as String
        required: [true, "Password is Required"], // This field is required with a custom error message
    },
    refreshToken:{
        type: String, // Define the type of the field as String (for storing refresh tokens)
    },
},
{
    timestamps: true // Automatically add createdAt and updatedAt fields
});

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next(); // Proceed if the password field is not modified

    // Hash the password using bcrypt before saving
    this.password = await bcrypt.hash(this.password, 10);
    next(); // Proceed to the next middleware or save the document
});

userSchema.methods.isPasswordCorrect = async function(password){
    // Compare the provided password with the hashed password in the database
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    // Generate an access token with user details
    return jwt.sign({
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName
    }, process.env.ACCESS_TOKEN_SECRET, { // Secret key from environment variables
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Token expiry time from environment variables
    });
};

userSchema.methods.generateRefreshToken = function(){
    // Generate a refresh token with user ID
    return jwt.sign({
        _id: this._id
    }, process.env.REFRESH_TOKEN_SECRET, { // Secret key from environment variables
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY // Token expiry time from environment variables
    });
};

export const User = mongoose.model("User", userSchema); // Export the User model
