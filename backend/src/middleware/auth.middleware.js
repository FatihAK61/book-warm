import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    // get token
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token)
      return res
        .status(401)
        .json({ message: "Not authorized, access denied!" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check if user exists in the database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Token is not valid!" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error :", error.message);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export default protectRoute;
