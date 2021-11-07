/**@type {Express.Request}*/

import asyncHandler from "../middliware/asyncHandler.js";
import Bootcamps from "../model/Bootcamps.js";
import ErrorResponse from "../utils/errorResponse.js";
import geocoder from "../utils/geocoder.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: "./config/config.env" });
//get all bootcamps
//get /api/v1/bootcamps
//public
export const getAllBootcamps = asyncHandler(async (req, res) => {
  const reqQuery = { ...req.query };

  const removeFields = ["select", "sort", "limit", "page"];

  removeFields.forEach((param) => delete reqQuery[param]);

  const strQuery = JSON.parse(
    JSON.stringify(reqQuery).replace(
      /\b(gt|gte|lt|lte|in)\b/,
      (match) => `$${match}`
    )
  );

  let query = Bootcamps.find(strQuery).populate("courses");
  //select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdA");
  }
  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const skip = (page - 1) * limit;

  const total = await Bootcamps.countDocuments();

  query = query.skip(skip).limit(limit);

  const pagination = {};
  pagination.documentsCount = total;
  if (page * limit < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (page * limit > 0) {
    pagination.prev = {
      prev: page - 1,
      limit: limit,
    };
  }
  const bootcamps = await query;

  if (bootcamps.length === 0) {
    return res.status(200).send({
      success: true,
      data: bootcamps,
      message: "Bootcams list is empty",
    });
  }
  res.status(200).send({ success: true, data: bootcamps, pagination });
});

//get single bootcamps
//get /api/v1/bootcamps/:id
//public
export const getSingleBootcamp = asyncHandler(async (req, res) => {
  const bootcamp = await Bootcamps.findById(req.params.id);
  if (!bootcamp) {
    throw new ErrorResponse("not found", 404);
  }
  res.status(200).send({
    success: true,
    data: bootcamp,
  });
});

//create new bootcamps
//post /api/v1/bootcamps
//privet
export const createBootcamp = asyncHandler(async (req, res) => {
  const { body } = req;
  body.user = req.user._id;
  const bootcamp = await Bootcamps.create(body);
  res.status(201).send({
    success: true,
    data: bootcamp,
    message: "Bootcamp was created",
  });
});

//update bootcamps
//post /api/v1/bootcamps/:id
//privet
export const updateBootcamp = asyncHandler(async (req, res) => {
  let updatedBootcamp = await Bootcamps.findById(req.params.id);
  if (!updatedBootcamp) {
    throw new ErrorResponse("not found", 404);
  }
  if (
    req.user._id !== updatedBootcamp.user.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ErrorResponse("Access denied", 403);
  }
  updatedBootcamp = await Bootcamps.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: updatedBootcamp });
});

//update bootcamps
//post /api/v1/bootcamps/:id
//privet
export const deleteBootcamp = asyncHandler(async (req, res) => {
  const bootcamp = await Bootcamps.findById(req.params.id);
  if (!bootcamp) {
    throw new ErrorResponse("not found", 404);
  }
  if (req.user._id !== bootcamp.user.toString() && req.user.role !== "admin") {
    throw new ErrorResponse("Access denied", 403);
  }
  await bootcamp.remove();
  res.status(200).send({ success: true });
});

//get bootcamps within aradius
//post /api/v1/bootcamps/radius/:zipcode/:distance
//privet
export const getBootcampsInRadius = asyncHandler(async (req, res) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  const radius = distance / 6378;
  console.log(radius);
  const bootcamps = await Bootcamps.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).send({ success: true, data: bootcamps });
});

export const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const file = req.files.file;
  const bootcamp = await Bootcamps.findById(req.params.id);
  if (!bootcamp) {
    throw new ErrorResponse("not found", 404);
  }
  if (!req.files) {
    throw new ErrorResponse("please upload file", 400);
  }

  if (!file.mimetype.startsWith("image")) {
    throw new ErrorResponse("please upload an image file", 400);
  }
  if (!file.size > process.env.MAX_FILE_UPLOAD) {
    throw new ErrorResponse(
      `please upload file less then ${process.env.MAX_FILE_UPLOAD}`,
      400
    );
  }
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(
    path.join(`${process.env.FILE_UPLOAD_PATH}`, file.name),
    async (err) => {
      if (err) {
        return next(new ErrorResponse("Problem with file upload", 500));
      }
      await Bootcamps.findOneAndUpdate(req.params.id, { photo: file.name });
      res.status(201).send({ success: true, data: file.name });
    }
  );
});
