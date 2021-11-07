import asyncHandler from "./asyncHandler.js";

import ErrorResponse from "../utils/errorResponse.js";

const protect =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new ErrorResponse("Access denied", 403));
    }
    next();
  };

export default protect;
