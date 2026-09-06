import aiProvider from "../providers/index.js";

/**
 * Faculty exam MCQ generator
 * Generates EXACT number of questions from extracted text using Ollama/Gemini
 */
const generateExamQuestions = async ({
  text,
  totalQuestions,
  difficulty,
  subject,
}) => {
  try {
    const questions = await aiProvider.generateMCQs({
      subject: subject || "General",
      materialText: text,
      questions: totalQuestions || 10,
      difficulty: difficulty || "medium",
      targetProficiencyLevel: 3,
      questionType: "knowledge",
      sourceReference: "Exam Material",
    });

    if (questions && questions.length > 0) {
      return questions.map((q, index) => ({
        questionId: q.questionId || `q_${index + 1}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
      }));
    }

    throw new Error("Failed to generate exam questions");
  } catch (error) {
    console.error("Exam Question Generation Error:", error.message);
    throw new Error(`Failed to generate exam questions: ${error.message}`);
  }
};

export default generateExamQuestions;
