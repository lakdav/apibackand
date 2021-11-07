import User from "../model/User.js";
import asyncHandler from "../middliware/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
export const useRregistartion = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    throw new ErrorResponse("Email is already busy", 400);
  }
  const newUser = await User.create(req.body);
  const token = newUser.getToken();
  res.status(200).send({ success: true, Token: token });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ErrorResponse("Please enter valid creadentials", 400);
  }
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    throw new ErrorResponse("Invalid credentials", 401);
  }
  const check = user.checkPaswword(password);
  if (!check) {
    throw new ErrorResponse("Invalid credentials", 401);
  }
  sendTokenResponse(user, 200, res);
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ErrorResponse("Not found", 404);
  }
  res.status(200).send({ success: true, data: user });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new ErrorResponse("Not found", 404);
  }
  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetpassword/${resetToken}`;

  const message = `=========================${resetUrl}`;
  try {
    await sendEmail({ email: user.email, subject: "Password", message });
    res.status(200).send({ success: true, data: "Email sent" });
  } catch (error) {
    console.log(error);
    user.resetPassworToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be send", 500));
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetPasswordToken)
    .digest("hex");
  console.log("user");

  const user = await User.findOne({
    resetPassworToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ErrorResponse("Invalid token", 400);
  }
  user.password = req.body.password;
  user.vresetPassworToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

export const updateDetails = asyncHandler(async (req, res) => {
  const fieldsUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user._id, fieldsUpdate, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new ErrorResponse("Not found", 404);
  }
  res.status(200).send({ success: true, data: user });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ErrorResponse("Invalid credantials", 400);
  }
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    throw new ErrorResponse("Not found", 404);
  }
  const verify = await user.checkPaswword(currentPassword);
  console.log(verify);
  if (!verify) {
    throw new ErrorResponse("Password is incorrect", 401);
  }
  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

function sendTokenResponse(user, status, res) {
  const token = user.getToken();
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if ((process.env.NODE_ENV = "production")) {
    options.secure = true;
  }
  res
    .status(status)
    .cookie("token", token, options)
    .json({ success: true, token });
}
