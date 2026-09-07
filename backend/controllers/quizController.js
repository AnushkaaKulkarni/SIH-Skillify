import { generateQuizQuestions } from "../services/quizGenerationService.js"

export const generateQuiz = async (req, res) => {
  const { subject, questions } = req.body

  try {
    const quizQuestions = await generateQuizQuestions({
      subject,
      questions,
      difficulty: "mixed",
    })

    res.json({
      success: true,
      questions: quizQuestions,
    })
  } catch (err) {
    res.status(503).json({ success: false, message: err.message || "Quiz generation failed" })
  }
}
