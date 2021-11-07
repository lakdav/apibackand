import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse.js";
import User from "../model/User.js";
import dotenv from "dotenv";
dotenv.config("./config/config.env");

const auth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //    else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  if (!token) {
    throw new ErrorResponse("Not authorize", 401);
  }
  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decode.id);
    next();
  } catch (err) {
    console.log(err);
    throw new ErrorResponse("Not authorize", 401);
  }
});

export default auth;
