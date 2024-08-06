// import router from "../routes/user.routes.js";
import { asyncHandler } from "../utils/asyncHandier.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/User.model.js";
import {uploadOnCloudnary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  // 1. get user details from  frontend.
  // 2. validation - not empty 
  // 3. check if user already exists : username, email
  // 4. check for images, check for avatar
  // 5. upload them to cloudinary, avatar 
  // 6. create user object - create entry in db
  // 7. remove password and refresh token fileld from response
  // 8. check for user create
  // 9. retun res. 

     const {fullName, email, username, password} = req.body
     console.log( "email:", email);

  if([fullName, email, username, password].some((field)=>
    field?.trim() === "")
  )
  {
    throw new ApiError(400, "All fields are required")
  }
     
   const existedUser =  User.findOne({
    $or: [{ email }, { username }]
  })

  if (existedUser) {
    throw new ApiError(409, "User already exists with this email or username")
  }

  const avatarLocaloPath =  req.files?.avatar[0]?.path; 
  const coverImageLocalPath = req.files?.coverImage[0]?.path; 

   if(!avatarLocaloPath){
    throw new ApiError(400, "Avatar file is required")

  }

  const avatar =  await uploadOnCloudnary(avatarLocaloPath)
  const coverImage = await uploadOnCloudnary(coverImageLocalPath)

  if(!avatar){
    throw new ApiError(400, "Avatar file is required")
  }
  
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ) 

  if(!createdUser){
    throw new ApiError(500, "Something went wrong creating User")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )




});

export { registerUser };
