// import router from "../routes/user.routes.js";
import { asyncHandler } from "../utils/asyncHandier.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

// generating access token and RefreshToken
const generateAccessTokenAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

  } catch (error) {

    throw ApiError(500, "Something went wrong While generateAccessTokenAndRefreshTokens")
  }
}
// Register User
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

  // const coverImageLocalPath = req.files?.coverImage[0]?.path;


  //! uploding cover Image is not required that because we use this way. 

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  console.log(" this is coverImgpath:", coverImageLocalPath);


  if (!avatarLocaloPath) {
    throw new ApiError(400, "Avatar file is required")

  }

  const avatar = await uploadOnCloudnary(avatarLocaloPath)
  // console.log(avatar);

  const coverImage = await uploadOnCloudnary(coverImageLocalPath)
  console.log(" this is coverimage", coverImage);


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
  console.log("this is user data:", user);


  if (!createdUser) {
    throw new ApiError(500, "Something went wrong creating User")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser,
      "User registered Successfully")
  )
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email 
  // find the user 
  // password check 
  // access and refresh token  
  // send cookie 

  const { email, userName, password } = req.body
  console.log(email);


  if (!userName && !email) {
    throw new ApiError(400, "Username or email is required")
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const user = await User.findOne({
    $or: [{ userName }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "User does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
  }

  const { accessToken, refreshToken } = await
    generateAccessTokenAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

  const options = {

    httpOnly: true,
    secure: true,

  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser, accessToken: accessToken, refreshToken: refreshToken
      },
        "User Logged In Successfully"
      )
    )
})

// logoutUser 
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )
  const options = {
    httpOnly: true,
    secure: true,
  }
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged In Successfully"))

})
// refresh tiken  expires new refresh token creat 
const refreshAccessToken = asyncHandler(async (req, res) => {

  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken != user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired and used")
    }

    const options = {
      httpOnly: true,
      secure: true,
    }
    const { accessToken, newRefreshToken } = await
     generateAccessTokenAndRefreshTokens(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, {
          accessToken: accessToken, refreshToken: newRefreshToken
        },
          "Access token returned")
      )
  } catch (error) {
    throw new ApiError(401,  error?.message ||
       "Invalid refresh token")
  }
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
};

