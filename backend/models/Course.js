import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  link: String,
  snippet: String,
  platform: String,
  difficulty: String,     // ✅ NEW
  thumbnail: String,     // ✅ NEW
  type: String,          // ✅ NEW (web / youtube)
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Course", courseSchema);
