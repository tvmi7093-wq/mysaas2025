
import { GoogleGenAI, Type } from "@google/genai";
import { Language, Recipe } from '../types';

const getLanguageName = (code: Language): string => {
  switch (code) {
    case 'en': return 'English';
    case 'fr': return 'French';
    case 'es': return 'Spanish';
    case 'ar': return 'Arabic';
    default: return 'English';
  }
}

const generateRecipe = async (
  base64ImageData: string,
  mimeType: string,
  language: Language
): Promise<Recipe> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const langName = getLanguageName(language);

  const systemInstruction = `You are an expert chef who creates simple, easy-to-follow recipes from images of food.
  - Analyze the provided image.
  - Identify the main dish.
  - Generate a recipe for that dish.
  - The recipe must be in ${langName}.
  - Your response MUST be a valid JSON object that strictly adheres to the provided schema. Do not add any extra text or explanations outside of the JSON structure.`;
  
  const textPart = {
    text: `Generate a recipe for the dish in this image. The language of the recipe must be ${langName}.`
  };
  
  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: mimeType,
    },
  };
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [textPart, imagePart] },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: `The name of the recipe in ${langName}.`,
          },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
              description: `A single ingredient with its quantity, in ${langName}.`,
            },
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
              description: `A single step of the recipe instructions, in ${langName}.`,
            },
          },
        },
        required: ["title", "ingredients", "steps"],
      },
    },
  });

  try {
    const jsonString = response.text;
    const recipeData = JSON.parse(jsonString);
    
    // Basic validation to ensure the structure matches our Recipe interface
    if (
        typeof recipeData.title === 'string' &&
        Array.isArray(recipeData.ingredients) &&
        Array.isArray(recipeData.steps)
    ) {
        return recipeData as Recipe;
    } else {
        throw new Error("Parsed JSON does not match recipe structure.");
    }
  } catch (e) {
    console.error("Failed to parse JSON response:", response.text, e);
    throw new Error("The AI returned an invalid format. Please try again.");
  }
};

export const geminiService = {
  generateRecipe,
};
