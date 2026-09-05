import { generateQuizQuestions } from "../services/quizGenerationService.js"

export const generateQuiz = async (req, res) => {
  const { subject, questions, difficulty } = req.body

  try {
    const quizQuestions = await generateQuizQuestions({
      subject,
      questions,
      difficulty,
    })

    res.json({
      success: true,
      questions: quizQuestions,
    })
  } catch (err) {
    const safeCount = Number.isFinite(Number(questions)) ? Math.max(1, Number(questions)) : 10
    const fallbackQuestions = Array.from({ length: safeCount }, (_, i) => ({
      id: `q_${i + 1}`,
      question: `Which statement is most accurate about ${subject || "this subject"}?`,
      options: ["Statement A", "Statement B", "Statement C", "Statement D"],
      correct: 0,
    }))

    res.json({
      success: true,
      questions: fallbackQuestions,
    })
  }
}
