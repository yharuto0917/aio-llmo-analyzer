const { GoogleGenAI, Type, ThinkingLevel } = require("@google/genai");
require("dotenv").config({ path: ".env.local" });

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: "Fetch and summarize https://example.com",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            summary: { type: Type.STRING },
          },
          required: ["success", "summary"]
        },
        tools: [{ googleSearch: {} }],
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.MEDIUM
        }
      }
    });
    console.log("Success:", response.text);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
test();
