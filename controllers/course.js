/**@type {Express.Request}*/

import asyncHandler from "../middliware/asyncHandler.js";
import Course from "../model/Course.js";
import Bootcamp from "../model/Bootcamps.js";
import ErrorResponse from "../utils/errorResponse.js";

//get sourses
//get /api/v1/courses   get /api/v1/bootcamps/:bootcampsId/courses
//public

export const getCourses = asyncHandler(async (req, res) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
export const getSingleCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    throw new ErrorResponse("Not found", 404);
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

//get sourses
//get  get /api/v1/bootcamps/:bootcampsId/courses
//privet
export const createCourse = asyncHandler(async (req, res) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user._id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    throw new ErrorResponse("Bootcamp not found", 404);
  }
  if (req.user._id !== bootcamp.user.toString() && req.user.role !== "admin") {
    throw new ErrorResponse("Access denied", 403);
  }
  const course = await Course.create(req.body);
  res.status(201).send({ success: true, data: course });
});

export const updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    throw new ErrorResponse("Not found", 404);
  }
  if (req.user._id !== course.user.toString() && req.user.role !== "admin") {
    throw new ErrorResponse("Access denied", 403);
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).send({ success: true, data: course });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    throw new ErrorResponse("Not found", 404);
  }
  if (req.user._id !== course.user.toString() && req.user.role !== "admin") {
    throw new ErrorResponse("Access denied", 403);
  }
  await course.remove();
  res.status(200).send({ success: true, data: [] });
});
