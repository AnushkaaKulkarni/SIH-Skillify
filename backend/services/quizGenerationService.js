import aiGateway from "../ai/gateway/aiGateway.js";

/* ------------------ helpers ------------------ */

const toNumber = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeQuestion = (question, index) => {
  const optionsRaw = Array.isArray(question?.options) ? question.options : [];
  const options = optionsRaw.map((o) => String(o ?? "")).slice(0, 4);

  while (options.length < 4) options.push("");

  const correct = toNumber(question?.correct, 0);
  const safeCorrect = correct >= 0 && correct < 4 ? correct : 0;

  return {
    id: String(question?.id || `q_${index + 1}`),
    question: String(question?.question || ""),
    options,
    correct: safeCorrect,
  };
};

const normalizeQuestionSet = (questions) =>
  (Array.isArray(questions) ? questions : []).map(normalizeQuestion);

/* ------------------ fallback (generic only) ------------------ */

const genericFallback = (count) => {
  const safeCount = Math.max(1, toNumber(count, 10));
  const base = [
    {
      question: "Which option is correct?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 0,
    },
  ];

  return Array.from({ length: safeCount }, (_, i) =>
    normalizeQuestion(
      {
        ...base[i % base.length],
        id: `q_${i + 1}`,
      },
      i
    )
  );
};

/* ------------------ main service ------------------ */

export const generateQuizQuestions = async ({
  subject,
  questions,
  difficulty,
  classification = "CATEGORY_A_OPEN_ACCESS",
  classificationSource = "MOSPI_GSDD_2026",
  externalAIAllowed = true,
}) => {
  const safeCount = Math.max(1, toNumber(questions, 10));
  const safeDifficulty = String(difficulty || "mixed").toLowerCase();
  const safeSubject = String(subject || "general").trim();

  const prompt = `
Generate ${safeCount} multiple-choice questions strictly based on:
"${safeSubject}"

Difficulty: ${safeDifficulty}

Rules:
- Questions must ONLY belong to the given subject/topic
- 4 options exactly
- One correct answer
- No explanations
- No extra text
- Output ONLY valid JSON in the format below

{
  "questions": [
    {
      "id": "q1",
      "question": "",
      "options": ["", "", "", ""],
      "correct": 0
    }
  ]
}
`;

  try {
    const gatewayResponse = await aiGateway.generateStructured({
      capability: "quiz_generation",
      content: prompt,
      classification,
      classificationSource,
      externalAIAllowed,
      systemPrompt: "You are an educational quiz generator. Generate valid JSON only.",
      schema: { questions: "array" },
      maxTokens: 2048,
      temperature: 0.7,
      preferredProvider: "auto",
    });

    if (gatewayResponse.success && gatewayResponse.data) {
      const parsed = normalizeQuestionSet(gatewayResponse.data.questions || []);
      if (parsed.length > 0) {
        return parsed.slice(0, safeCount);
      }
    }
    
    // If gateway blocked or failed, log and use fallback
    console.warn("AI Gateway quiz generation failed:", gatewayResponse.reason || gatewayResponse.error);
  } catch (error) {
    console.error("AI Gateway error:", error.message);
  }

  // absolute last safety net
  console.warn("Using generic fallback questions");
  return genericFallback(safeCount);
};

export default generateQuizQuestions;