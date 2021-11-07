import express from "express";
import auth from "../middliware/auth.js";
import * as controller from "../controllers/course.js";
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(controller.getCourses)
  .post(auth, controller.createCourse);
//   .post(controller.);

router
  .route("/:id")
  .get(controller.getSingleCourse)
  .put(auth, controller.updateCourse)
  .delete(auth, controller.deleteCourse);

export default router;
