import express from "express";
import {
  searchCourses,
  saveCourse,
  getSavedCourses,
  deleteCourse,
  getPersonalizedRecommendations,
} from "../controllers/courseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/search", protect, searchCourses);
router.get("/recommendations", protect, getPersonalizedRecommendations);
router.post("/save", protect, saveCourse);
router.get("/saved", protect, getSavedCourses);
router.delete("/delete/:id", protect, deleteCourse);


export default router;
