import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { 
  summarizeMaterial, 
  generateAINotes, 
  downloadAINotePDF, 
  getSavedNotes, 
  getAINoteById 
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/summarize/:materialId", protect, summarizeMaterial);
router.post("/generate-notes", protect, generateAINotes);
router.get("/saved-notes", protect, getSavedNotes);
router.get("/notes/:noteId", protect, getAINoteById);
router.get("/download/:noteId/pdf", protect, downloadAINotePDF);
router.get("/test", (req, res) => {
  res.json({ message: "AI routes are working!" });
});

export default router;