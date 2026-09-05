import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    competency: { type: mongoose.Schema.Types.ObjectId, ref: "Competency" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    sourceType: { type: String, enum: ["internal", "igot", "nssta", "other"], default: "internal" },
    sourceUrl: String,
    status: { type: String, enum: ["new", "in_progress", "completed"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("Recommendation", recommendationSchema);
