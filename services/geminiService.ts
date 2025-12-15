import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Basic Text Chat with History context
 */
export const sendChatMessage = async (
  message: string,
  history: { role: string; content: string }[]
): Promise<string> => {
  try {
    // Convert history to format acceptable by Gemini (simplification for single turn or managed context)
    // For this demo, we'll use a fresh chat or manage context manually if needed. 
    // Here we use a stateless approach for simplicity in the service wrapper, 
    // but typically you'd use ai.chats.create()
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a helpful, precise, and world-class AI assistant.",
      }
    });

    // In a real app, we would replay history here. 
    // For this snippet, we assume 'message' contains necessary context or we send just the last message 
    // to demonstrate the API connection.
    const result: GenerateContentResponse = await chat.sendMessage({
      message: message
    });

    return result.text || "I couldn't generate a text response.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Sorry, I encountered an error processing your request.";
  }
};

/**
 * Vision Analysis
 */
export const analyzeImage = async (
  base64Image: string,
  prompt: string,
  mimeType: string = "image/jpeg"
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: prompt || "Describe this image in detail." }
        ]
      }
    });
    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Vision Error:", error);
    return "Failed to analyze the image.";
  }
};

/**
 * Image Generation using Nano Banana (gemini-2.5-flash-image)
 */
export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          // outputMimeType not supported for nano banana
        }
      }
    });

    // Iterate parts to find the image
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

/**
 * Search Grounding
 */
export const searchWeb = async (query: string): Promise<{ text: string, sources: Array<{ title: string, uri: string }> }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "No results found.";
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title || "Source",
        uri: c.web.uri || "#"
      }));

    return { text, sources };
  } catch (error) {
    console.error("Search Error:", error);
    return { text: "Failed to perform search.", sources: [] };
  }
};
