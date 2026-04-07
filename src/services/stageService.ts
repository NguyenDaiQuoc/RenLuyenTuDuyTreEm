import { GoogleGenAI, Type } from "@google/genai";
import { Stage, SubjectId, Difficulty, ExerciseType, InteractionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getDifficulty = (level: number): Difficulty => {
  if (level <= 75) return "easy";
  if (level <= 150) return "medium";
  if (level <= 225) return "hard";
  return "expert";
};

const getExerciseTypes = (subject: SubjectId): ExerciseType[] => {
  switch (subject) {
    case "math":
      return ["counting", "pattern", "arithmetic", "comparison", "sequence", "puzzle", "word-problem", "shape"];
    case "science":
      return ["identification", "habitat", "cause-effect", "experiment", "body-parts", "weather", "food-chain"];
    case "logic":
      return ["pattern-puzzle", "odd-one-out", "memory", "visual-reasoning", "maze", "classification", "problem-solving"];
  }
};

import { getStageInfo } from "./skillTreeService";

export const generateStage = async (subject: SubjectId, level: number): Promise<Stage | null> => {
  const stageInfo = getStageInfo(subject, level);
  const difficulty = stageInfo.difficulty as Difficulty;
  const types = getExerciseTypes(subject);
  const randomType = types[Math.floor(Math.random() * types.length)];
  const interactionTypes: InteractionType[] = ["multiple-choice", "drag-drop", "match", "puzzle"];
  const randomInteraction = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
  const seed = Math.random().toString(36).substring(7);

  const prompt = `Generate a thinking-based exercise for a child (age 3+).
  Subject: ${subject}
  Theme: ${stageInfo.theme}
  Level: ${level} (out of 300)
  Stage Index: ${stageInfo.stageIndex} (out of 10 in this node)
  Difficulty: ${difficulty}
  Exercise Category: ${randomType}
  Interaction Type: ${randomInteraction}
  Random Seed: ${seed}
  
  The exercise should be engaging, visual-friendly, and non-repetitive.
  Focus on cognitive development and problem-solving related to the theme: ${stageInfo.theme}.
  
  For "multiple-choice": Provide 4 options and 1 correctAnswer.
  For "drag-drop": Provide items in "options" and the correct sequence or target in "correctAnswer".
  For "match": Provide pairs in "gameData" (e.g., { pairs: [{ left: "Apple", right: "Red" }, ...] }).
  For "puzzle": Provide puzzle pieces or logic steps in "gameData".
  
  IMPORTANT: If the subject is "science" or "logic", try to include an "imageUrl" using a descriptive keyword from Unsplash or similar (e.g., "https://picsum.photos/seed/${seed}/800/400").
  
  Return the result in JSON format matching the Stage interface.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            nodeId: { type: Type.STRING },
            subject: { type: Type.STRING, enum: ["math", "science", "logic"] },
            level: { type: Type.INTEGER },
            difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard", "expert"] },
            type: { type: Type.STRING },
            interactionType: { type: Type.STRING, enum: ["multiple-choice", "drag-drop", "match", "puzzle"] },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            xpReward: { type: Type.INTEGER },
            imageUrl: { type: Type.STRING },
            gameData: { type: Type.OBJECT }
          },
          required: ["id", "nodeId", "subject", "level", "difficulty", "type", "interactionType", "question", "options", "correctAnswer", "explanation", "xpReward"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    const stage = JSON.parse(text) as Stage;
    // Ensure the generated stage matches the requested level and subject
    stage.level = level;
    stage.subject = subject;
    stage.difficulty = difficulty;
    stage.nodeId = stageInfo.nodeId;
    
    return stage;
  } catch (error) {
    console.error("Error generating stage:", error);
    return null;
  }
};
