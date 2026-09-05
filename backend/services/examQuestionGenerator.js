import axios from "axios";

const AI_API_KEY = process.env.SKILLIFY_AI_EXAM_KEY;

if (!AI_API_KEY) {
  throw new Error("SKILLIFY_AI_EXAM_KEY is missing in .env");
}

/**
 * Faculty exam MCQ generator
 * Generates EXACT number of questions from extracted text
 */
const generateExamQuestions = async ({
  text,
  totalQuestions,
  difficulty,
  subject,
}) => {
  const prompt = `
You are an academic exam paper generator.

Subject: ${subject}
Difficulty Level: ${difficulty}

TASK:
Generate EXACTLY ${totalQuestions} multiple-choice questions from the content below.

RULES (STRICT):
- Each question must have exactly 4 options
- Only ONE option is correct
- No explanations
- No markdown
- No extra text
- Output ONLY a valid JSON ARRAY

FORMAT:
[
  {
    "questionId": "q1",
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]

CONTENT:
${text}
`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        params: { key: AI_API_KEY },
        headers: { "Content-Type": "application/json" },
      }
    );

    const rawText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Empty response from AI");
    }

    let questions;
    try {
      questions = JSON.parse(rawText);
    } catch {
      throw new Error("AI response is not valid JSON");
    }

    if (!Array.isArray(questions)) {
      throw new Error("AI response is not an array");
    }

    // Basic validation
    questions.forEach((q, index) => {
      if (
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correctAnswer !== "number"
      ) {
        throw new Error(`Invalid question format at index ${index}`);
      }
    });

    return questions;
  } catch (error) {
    console.error("Exam Question Generation Error:", error.message);
    throw new Error("Failed to generate exam questions");
  }
};

export default generateExamQuestions;
