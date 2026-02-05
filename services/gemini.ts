
import { GoogleGenAI, Type } from "@google/genai";

export const getCinematicOutlook = async (year: number, movies: string[]) => {
  try {
    // Basic check to prevent ReferenceError if process is not defined in the environment
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : null;
    if (!apiKey) {
      throw new Error("API Key is not configured");
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a brief cinematic outlook for the year ${year}. Based on these upcoming movies: ${movies.slice(0, 10).join(', ')}, what are the major trends or themes we might see? Keep it exciting and under 150 words.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            anticipatedTrends: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["summary", "anticipatedTrends"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      summary: `The year ${year} promises to be a landmark period for cinema, featuring a diverse array of sequels and original stories from major American studios.`,
      anticipatedTrends: ["The return of major franchises", "Evolved visual storytelling", "Genre-bending narratives"]
    };
  }
};
