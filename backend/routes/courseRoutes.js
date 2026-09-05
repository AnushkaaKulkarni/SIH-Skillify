import express from "express";
import {
  searchCourses,
  saveCourse,
  getSavedCourses,
  deleteCourse,
} from "../controllers/courseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/search", protect, searchCourses);
router.post("/save", protect, saveCourse);
router.get("/saved", protect, getSavedCourses);
router.delete("/delete/:id", protect, deleteCourse);


export default router;
