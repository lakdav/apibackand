import asyncHandler from "../middliware/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import Review from "../model/Review.js";
import dotenv from "dotenv";
import Bootcamp from "../model/Bootcamps.js";
dotenv.config({ path: "./config/config.env" });

export const getReviews = asyncHandler(async (req, res) => {
  if (req.params.bootcampId) {
    const rewiews = await Review.find({ bootcamp: req.params.bootcampId });
    res.status(200).send({
      success: true,
      count: rewiews.length,
      data: rewiews,
    });
  } else {
    res.status(200).send(res.advancedResults);
  }
});
export const getReview = asyncHandler(async (req, res) => {
  const rewiew = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!rewiew) {
    throw new ErrorResponse("Not found", 404);
  }
  res.status(200).send({ success: true, data: rewiew });
});
export const addReview = asyncHandler(async (req, res) => {
  req.body.user = req.user._id;
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    throw new ErrorResponse("Not found", 404);
  }
  const rewiew = await Review.create(req.body);

  res.status(201).send({ success: true, data: rewiew });
});
