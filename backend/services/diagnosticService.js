import aiGateway from "../ai/gateway/aiGateway.js";
import Role from "../models/Role.js";
import { getRequiredCompetenciesForRole } from "./competencyEngine.js";
import { validateGeneratedQuestions } from "./questionValidationService.js";

export const generateDiagnosticQuestions = async ({ targetRole, count = 10 }) => {
  const role = await Role.findOne({ name: new RegExp(`^${String(targetRole || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"), isActive: true });
  if (!role) throw new Error("Select one of the configured prototype designations first.");
  const required = await getRequiredCompetenciesForRole(role._id);
  if (!required.length) throw new Error("No competency mapping is configured for this designation.");
  const compact = required.map((item) => ({ id: String(item.competency._id), name: item.competency.name, targetLevel: item.requiredLevel }));
  const prompt = `Generate exactly ${Math.max(5, Math.min(20, Number(count) || 10))} diagnostic MCQs for a ${role.name}. Cover the supplied competencies proportionally, with beginner, intermediate, and advanced reasoning. Return JSON {"questions":[{"question":"","options":["","","",""],"correctAnswer":0,"explanation":"","competencyId":"","targetProficiencyLevel":1,"difficulty":"easy|medium|hard","questionType":"diagnostic"}]}. Competencies: ${JSON.stringify(compact)}`;
  const response = await aiGateway.generateStructured({
    capability: "diagnostic_generation", content: prompt, classification: "CATEGORY_A_OPEN_ACCESS",
    classificationSource: "ORGANIZATION_POLICY", externalAIAllowed: false, forcePrivate: true,
    systemPrompt: "Generate accurate assessment questions. Return JSON only.", schema: { questions: "array" }, maxTokens: 4096, temperature: 0.2,
  });
  if (!response.success) throw new Error(response.reason || response.error || "Local diagnostic provider is unavailable.");
  return { role, questions: await validateGeneratedQuestions(response.data.questions, { allowedCompetencyIds: compact.map((item) => item.id), defaultLevel: 3, sourceReference: "Initial diagnostic assessment" }), provider: response.provider, model: response.metadata?.model };
};
