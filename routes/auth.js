import express from "express";
import * as controler from "../controllers/auth.js";
import auth from "../middliware/auth.js";
const router = express.Router();

router.route("/").post(controler.useRregistartion);
router.route("/login").post(controler.loginUser);
router.route("/me").get(auth, controler.getMe);
router.route("/password").post(controler.forgotPassword);
router.route("/password").put(auth, controler.updatePassword);
router.route("/update").put(auth, controler.updateDetails);
router.route("/password/:resetPasswordToken").put(controler.resetPassword);
export default router;
