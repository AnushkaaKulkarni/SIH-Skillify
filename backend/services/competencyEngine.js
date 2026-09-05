import Competency from "../models/Competency.js";
import Role from "../models/Role.js";
import RoleCompetency from "../models/RoleCompetency.js";
import UserCompetency from "../models/UserCompetency.js";
import SkillGap from "../models/SkillGap.js";

export const COMPETENCY_UPDATE_WEIGHTS = Object.freeze({
  previous: 0.7,
  latest: 0.3,
});

export const SCORE_LEVEL_THRESHOLDS = Object.freeze([
  { minimum: 0, level: 0 },
  { minimum: 20, level: 1 },
  { minimum: 40, level: 2 },
  { minimum: 60, level: 3 },
  { minimum: 75, level: 4 },
  { minimum: 90, level: 5 },
]);

export const scoreToLevel = (score) => {
  if (score === null || score === undefined || Number.isNaN(Number(score))) return 0;
  const normalizedScore = Math.max(0, Math.min(100, Number(score)));
  return SCORE_LEVEL_THRESHOLDS.reduce(
    (level, threshold) => (normalizedScore >= threshold.minimum ? threshold.level : level),
    0
  );
};

export const calculateCompetencyScore = ({ previousScore, latestScore } = {}) => {
  const latest = Number(latestScore);
  if (!Number.isFinite(latest)) return null;
  const boundedLatest = Math.max(0, Math.min(100, latest));
  const previous = Number(previousScore);
  if (!Number.isFinite(previous)) return boundedLatest;

  return Math.round(
    previous * COMPETENCY_UPDATE_WEIGHTS.previous +
    boundedLatest * COMPETENCY_UPDATE_WEIGHTS.latest
  );
};

export const calculateSkillGap = ({ requiredLevel, currentLevel } = {}) => {
  const required = Math.max(0, Math.min(5, Number(requiredLevel) || 0));
  const current = Math.max(0, Math.min(5, Number(currentLevel) || 0));
  const gap = required - current;
  return {
    requiredLevel: required,
    currentLevel: current,
    gap,
    status: gap <= 0 ? "addressed" : "open",
  };
};

const normalizeRoleName = (value) => String(value || "").trim();

export const getRequiredCompetenciesForRole = async (roleId) => {
  const mappings = await RoleCompetency.find({ role: roleId })
    .populate({
      path: "competency",
      populate: { path: "domain", select: "name description" },
    })
    .lean();

  return mappings
    .filter((mapping) => mapping.competency)
    .map((mapping) => ({
      competency: mapping.competency,
      domain: mapping.competency.domain,
      requiredLevel: mapping.requiredLevel,
    }));
};

const getRequiredForUser = async (user) => {
  const targetRole = normalizeRoleName(user.targetRole);
  if (!targetRole) return { targetRole: null, role: null, required: [] };

  const roles = await Role.find({ isActive: true }).lean();
  const role = roles.find((candidate) => candidate.name.toLowerCase() === targetRole.toLowerCase());

  if (!role) return { targetRole, role: null, required: [] };
  return { targetRole, role, required: await getRequiredCompetenciesForRole(role._id) };
};

export const recalculateSkillGaps = async (user) => {
  const { targetRole, role, required } = await getRequiredForUser(user);
  if (!targetRole || !role) {
    return { targetRole, role: null, required: [], message: "Target role not configured" };
  }

  const competencyIds = required.map(({ competency }) => competency._id);
  const currentRecords = await UserCompetency.find({
    user: user._id,
    competency: { $in: competencyIds },
  }).lean();
  const currentByCompetency = new Map(
    currentRecords.map((record) => [String(record.competency), record])
  );

  const gaps = [];
  for (const item of required) {
    const currentLevel = currentByCompetency.get(String(item.competency._id))?.currentLevel || 0;
    const result = calculateSkillGap({ requiredLevel: item.requiredLevel, currentLevel });
    const gap = await SkillGap.findOneAndUpdate(
      { user: user._id, competency: item.competency._id },
      {
        $set: {
          requiredLevel: result.requiredLevel,
          currentLevel: result.currentLevel,
          status: result.status,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    gaps.push({ ...result, competency: item.competency, record: gap });
  }

  return { targetRole, role, required, gaps };
};

export const updateCompetencyFromAssessment = async ({ user, questions, answers, source }) => {
  const answerMap = new Map((answers || []).map((answer) => [String(answer.questionId), answer]));
  const evidence = new Map();

  for (const question of questions || []) {
    if (!question.competency) continue;
    const answer = answerMap.get(String(question.questionId));
    const selected = answer?.selectedIndex ?? answer?.selectedOption;
    if (selected === null || selected === undefined) continue;

    const isCorrect = Number(selected) === Number(question.correctAnswer);
    const key = String(question.competency);
    const current = evidence.get(key) || { correct: 0, total: 0, competency: question.competency };
    current.correct += isCorrect ? 1 : 0;
    current.total += 1;
    evidence.set(key, current);
  }

  const updated = [];
  for (const item of evidence.values()) {
    if (!item.total) continue;
    const latestScore = Math.round((item.correct / item.total) * 100);
    const existing = await UserCompetency.findOne({ user: user._id, competency: item.competency });
    const score = calculateCompetencyScore({ previousScore: existing?.score, latestScore });
    const record = await UserCompetency.findOneAndUpdate(
      { user: user._id, competency: item.competency },
      {
        $set: {
          currentLevel: scoreToLevel(score),
          score,
          assessedAt: new Date(),
          source: source || "assessment",
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    updated.push(record);
  }

  const gapState = await recalculateSkillGaps(user);
  return { evidence: updated, ...gapState };
};

export const getLearnerCompetencyOverview = async (user) => {
  const gapState = await recalculateSkillGaps(user);
  const records = await UserCompetency.find({ user: user._id })
    .populate({ path: "competency", populate: { path: "domain" } })
    .lean();
  const currentByCompetency = new Map(records.map((record) => [String(record.competency?._id), record]));

  return {
    targetRole: gapState.targetRole,
    role: gapState.role,
    competencies: gapState.required.map((item) => ({
      competency: item.competency,
      domain: item.domain,
      requiredLevel: item.requiredLevel,
      current: currentByCompetency.get(String(item.competency._id)) || {
        currentLevel: 0,
        score: null,
        source: "no-evidence",
      },
      gap: gapState.gaps.find((gap) => String(gap.competency._id) === String(item.competency._id)),
    })),
    message: gapState.message,
  };
};

export default {
  calculateCompetencyScore,
  scoreToLevel,
  calculateSkillGap,
  getRequiredCompetenciesForRole,
  updateCompetencyFromAssessment,
  recalculateSkillGaps,
  getLearnerCompetencyOverview,
};
