import BaseAIProvider from "./baseProvider.js";

/**
 * Ollama AI Provider
 * 
 * Private/local AI provider using Ollama.
 * This provider is intended for on-premises or private cloud deployments.
 * 
 * IMPORTANT: "Private/local provider" does NOT automatically mean production-government
 * security compliance. Organizations must evaluate their specific security requirements.
 */
class OllamaProvider extends BaseAIProvider {
  constructor(config = {}) {
    super(config);
    this.baseUrl = config.baseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    this.modelName = config.model || process.env.OLLAMA_MODEL || "qwen3:8b";
    this.type = "private";
    
    // Ollama is optional - don't require it for startup
    console.log(`OllamaProvider configured: ${this.baseUrl}, model: ${this.modelName}`);
  }

  getType() {
    return "private";
  }

  async makeRequest(endpoint, payload) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("OllamaProvider request error:", error.message);
      throw error;
    }
  }

  async generateText({ prompt, systemPrompt, maxTokens, temperature = 0.7, ...options }) {
    try {
      const messages = [];
      
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      
      messages.push({ role: "user", content: prompt });
      
      const payload = {
        model: this.modelName,
        messages,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      };
      
      const response = await this.makeRequest("/api/chat", payload);
      
      const text = response?.message?.content || "";
      
      return {
        success: true,
        data: text,
        metadata: {
          provider: "ollama",
          model: this.modelName,
          tokensUsed: response?.eval_count || response?.prompt_eval_count,
        },
      };
    } catch (error) {
      console.error("OllamaProvider error:", error.message);
      return {
        success: false,
        error: error.message,
        metadata: {
          provider: "ollama",
          model: this.modelName,
        },
      };
    }
  }

  async generateStructured({ prompt, systemPrompt, schema, maxTokens, temperature = 0.7, ...options }) {
    try {
      const messages = [];
      
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      
      // Add JSON output instruction
      const jsonPrompt = schema 
        ? `${prompt}\n\nReturn STRICT JSON only. Do not include markdown code blocks.`
        : prompt;
      
      messages.push({ role: "user", content: jsonPrompt });
      
      const payload = {
        model: this.modelName,
        messages,
        stream: false,
        format: "json", // Request JSON format from Ollama
        options: {
          temperature,
          num_predict: maxTokens,
        },
      };
      
      const response = await this.makeRequest("/api/chat", payload);
      
      const text = response?.message?.content || "";
      
      // Clean markdown if present
      const cleanedText = text.replace(/```json|```/g, "").trim();
      
      let parsedData;
      try {
        parsedData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("OllamaProvider JSON parse error:", parseError.message);
        return {
          success: false,
          error: "Failed to parse JSON response",
          rawText: cleanedText,
          metadata: {
            provider: "ollama",
            model: this.modelName,
          },
        };
      }
      
      return {
        success: true,
        data: parsedData,
        metadata: {
          provider: "ollama",
          model: this.modelName,
          tokensUsed: response?.eval_count || response?.prompt_eval_count,
        },
      };
    } catch (error) {
      console.error("OllamaProvider structured error:", error.message);
      return {
        success: false,
        error: error.message,
        metadata: {
          provider: "ollama",
          model: this.modelName,
        },
      };
    }
  }

  async healthCheck() {
    const startTime = Date.now();
    
    try {
      // Check if Ollama is running
      const url = `${this.baseUrl}/api/tags`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Ollama health check failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Check if the configured model is available
      const models = data?.models || [];
      const modelAvailable = models.some(m => m.name.startsWith(this.modelName));
      
      const latency = Date.now() - startTime;
      
      return {
        available: modelAvailable,
        latency,
        metadata: {
          provider: "ollama",
          model: this.modelName,
          availableModels: models.map(m => m.name),
        },
        error: modelAvailable ? null : `Model ${this.modelName} not found in Ollama`,
      };
    } catch (error) {
      const latency = Date.now() - startTime;
      return {
        available: false,
        latency,
        error: error.message,
        metadata: {
          provider: "ollama",
          model: this.modelName,
        },
      };
    }
  }
}

export default OllamaProvider;
