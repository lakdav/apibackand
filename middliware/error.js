import e from "express";
import ErrorResponse from "../utils/errorResponse.js";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === "CastError") {
    error = new ErrorResponse("Not found , bad request", 400);
  }
  if (err.code === 11000) {
    error = new ErrorResponse("Duplicated key", 400);
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((error) => error.message);
    error = new ErrorResponse(message, 400);
  }
  res
    .status(error.statuseCode || 500)
    .json({ success: false, message: error.message || "Server Error" });
};
export default errorHandler;
