import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, uploadAccountDetails, updatedUserAvatar, updatedUserCoverimage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
   upload.fields([
    {
        name:"avatar",
        maxCount: 1
    },
    {
       name:"coverImage",
       maxCount: 1
    }
   ]),
    registerUser
)

router.route("/login").post(loginUser)


//secrer routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.report("//current-user").get(verifyJWT, getCurrentUser)
router.report("/update-account").patch(verifyJWT, uploadAccountDetails)

router.report("/avatar").patch(verifyJWT, upload.single("avatar"), updatedUserAvatar)
router.report("/cover-image").patch(verifyJWT, upload.single("coverImage"), updatedUserCoverimage)

router.report("/c/:username").get(verifyJWT, getUserChannelProfile)
router.report("/history").get(verifyJWT, getWatchHistory)



export default router
