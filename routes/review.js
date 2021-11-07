import express from "express";
import * as controler from "../controllers/review.js";
import advancedResults from "../middliware/advancedResults.js";
import auth from "../middliware/auth.js";
import protect from "../middliware/protect.js";
import review from "../model/Review.js";
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(review, { path: "bootcamp", select: "name description" }),
    controler.getReviews
  )
  .post(auth, protect("user", "admin"), controler.addReview);
router.route("/:id").get(controler.getReview);
export default router;
