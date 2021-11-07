import auth from "../middliware/auth.js";
import express from "express";
import * as controller from "../controllers/bootcamps.js";
import courseRouter from "./course.js";
import reviewRouter from "./review.js";
import protect from "../middliware/protect.js";
const router = express.Router();
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);
router.route("/radius/:zipcode/:distance").get(controller.getBootcampsInRadius);
router.route("/:id/photo").put(auth, controller.bootcampPhotoUpload);
router
  .route("/")
  .get(controller.getAllBootcamps)
  .post(auth, protect("user"), controller.createBootcamp);

router
  .route("/:id")
  .get(controller.getSingleBootcamp)
  .put(auth, controller.updateBootcamp)
  .delete(auth, controller.deleteBootcamp);

export default router;
