// import router from "../routes/user.routes.js";
import { asyncHandler } from "../utils/asyncHandier.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    massage: " chai aur code",
  });
});

export { registerUser };
