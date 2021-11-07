import User from "../model/User.js";
import asyncHandler from "../middliware/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  res.status(200).send(res.advancedResults);
});
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById();
  res.status(200).send({ success: true, data: user });
});
