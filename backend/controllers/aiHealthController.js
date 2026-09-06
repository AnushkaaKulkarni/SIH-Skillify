import aiGateway from "../ai/gateway/aiGateway.js";
export const getAIHealth = async (_req, res) => {
  const providers = await aiGateway.healthCheck();
  const configured = process.env.AI_PRIVATE_PROVIDER || "ollama";
  res.json({ success: true, configuredPrivateProvider: configured, privateProvider: providers[configured] || null, providers });
};
