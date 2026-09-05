import mongoose from "mongoose";

const roleCompetencySchema = new mongoose.Schema(
  {
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    competency: { type: mongoose.Schema.Types.ObjectId, ref: "Competency", required: true },
    requiredLevel: { type: Number, min: 0, max: 5, default: 0 },
  },
  { timestamps: true }
);

roleCompetencySchema.index({ role: 1, competency: 1 }, { unique: true });

export default mongoose.model("RoleCompetency", roleCompetencySchema);
