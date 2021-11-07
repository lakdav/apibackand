import Mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config("./config/config.env");
const userShema = new Mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please add name"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add Email"],
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: (props) => `${props.value} is not a valid Email!`,
      },
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    resetPassworToken: String,
    resetPasswordExpire: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);
userShema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userShema.methods.getToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};
userShema.methods.checkPaswword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
userShema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPassworToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};
const user = Mongoose.model("User", userShema);

export default user;
