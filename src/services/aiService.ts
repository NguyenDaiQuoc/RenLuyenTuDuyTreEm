import { GoogleGenAI, Type } from "@google/genai";
import { Exercise } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateAIExercises = async (age: number, subject: string, difficulty: number): Promise<Exercise[]> => {
  const prompt = `Generate 5 thinking-based exercises for a ${age}-year-old child about ${subject}. 
  Difficulty level: ${difficulty} (1-5).
  The exercises should focus on logic, creativity, visual patterns, or problem-solving, NOT rote memorization.
  Make them fun, visual-friendly, and short.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { 
                type: Type.STRING, 
                enum: ['logic', 'visual', 'memory', 'problem-solving', 'creative'] 
              },
              difficulty: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              answer: { type: Type.STRING },
              explanation: { type: Type.STRING },
              xpReward: { type: Type.INTEGER },
              imageUrl: { type: Type.STRING }
            },
            required: ['id', 'type', 'difficulty', 'question', 'explanation', 'xpReward']
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating AI exercises:", error);
    return [];
  }
};
