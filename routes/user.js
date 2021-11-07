import express from "express";
import * as controler from "../controllers/user.js";
import advancedResults from "../middliware/advancedResults.js";
import auth from "../middliware/auth.js";
import protect from "../middliware/protect.js";
import User from "../model/User.js";

const router = express.Router();
router.use(auth);
router.use(protect("admin"));
router.route("/").get(advancedResults(User), controler.getUsers);
router.route("/:id").get(controler.getUser);
export default router;
