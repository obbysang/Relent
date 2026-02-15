
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseTaskWithAI = async (input: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse the following task input and extract details: "${input}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Short title of the task" },
            description: { type: Type.STRING, description: "Detailed description of the task" },
            deadline: { type: Type.STRING, description: "ISO 8601 date string for the deadline. If not specified, default to 24 hours from now." },
            reminderInterval: { type: Type.INTEGER, description: "Reminder interval in minutes. Default to 60 if not specified." }
          },
          required: ["title", "description", "deadline", "reminderInterval"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    return null;
  }
};
