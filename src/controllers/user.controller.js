// import router from "../routes/user.routes.js";
import { asyncHandler } from "../utils/asyncHandier.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  // 1. get user details from  frontend.
  // 2. validation - not empty 
  // 3. check if user already exists : userName, email
  // 4. check for images, check for avatar
  // 5. upload them to cloudinary, avatar 
  // 6. create user object - create entry in db
  // 7. remove password and refresh token fileld from response
  // 8. check for user create
  // 9. retun res. 

  const { fullName, email, userName, password } = req.body
  console.log("email:", email, "userName:", userName);

  if ([fullName, email, userName, password].some((field) =>
    field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { userName }]
  })

  if (existedUser) {
    throw new ApiError(409, "User already exists with this email or userName")
  }

  const avatarLocaloPath = req.files?.avatar[0]?.path;

  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  
  
  //! uploding cover Image is not required that because we use this way. 

  // let coverImageLocalPath;
  // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }
  // console.log(" this is coverImgpath:",coverImageLocalPath);
  

  if (!avatarLocaloPath) {
    throw new ApiError(400, "Avatar file is required")

  }

  const avatar = await uploadOnCloudnary(avatarLocaloPath)
  // console.log(avatar);

  const coverImage = await uploadOnCloudnary(coverImageLocalPath)
  console.log(" this is coverimage",coverImage);


  if (!avatar) {
    throw new ApiError(400, "Avatar file is required")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverimage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  console.log( "this is user data:",user);
  

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong creating User")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser,
      "User registered Successfully")
  )




});

export { registerUser };
