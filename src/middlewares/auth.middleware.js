import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandier";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";

export const  verifyJWT  = asyncHandler(async(req, res, next) => {
  
   try {
    const token =  req.cookies?.accessToken || req.header
     ("Authorization")?.replace("Bearer " , "")
 
     if(!token) {
         throw new ApiError(401, "User not authorized")
     }
     
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
     const user =  await User.findById(decodedToken?._id)
     .select("-password -refreshToken")
 
     if(!user){
     //    next Todo: discuss about frontend
         throw new ApiError(401, "Invalid access token")
     }
 
     req.user = user
     next()

   } catch (error) {

    throw new ApiError(401, error.message || "Invalid access token")
    
   }
})