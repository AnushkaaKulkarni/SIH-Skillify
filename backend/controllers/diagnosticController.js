import Exam from "../models/Exam.js";
import { generateDiagnosticQuestions } from "../services/diagnosticService.js";

export const createDiagnostic = async (req, res) => {
  try {
    if (!['learner', 'student'].includes(req.user.role)) return res.status(403).json({ message: "Learner access required." });
    const targetRole = req.user.targetRole || req.user.designation;
    const generated = await generateDiagnosticQuestions({ targetRole, count: req.body.questionCount });
    const exam = await Exam.create({ title: `${generated.role.name} initial diagnostic`, description: "Initial competency diagnostic assessment", subject: generated.role.name, faculty: req.user._id, duration: 30, totalQuestions: generated.questions.length, questions: generated.questions, competencyTags: generated.questions.map((question) => question.competency), assessmentType: "DIAGNOSTIC", generatedByModel: generated.model || generated.provider, status: "SCHEDULED", scope: "SELECTED", assignedStudents: [req.user._id], scheduledAt: new Date() });
    res.status(201).json({ success: true, examId: exam._id, status: exam.status, provider: generated.provider, questions: exam.questions.map(({ correctAnswer, ...question }) => question) });
  } catch (error) { res.status(error.message.includes("unavailable") ? 503 : 400).json({ message: error.message }); }
};
