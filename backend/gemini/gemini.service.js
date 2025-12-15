import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Chat
 */
export async function chat(message) {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction:
        "You are a helpful, precise, and world-class AI assistant.",
    },
  });

  const result = await chat.sendMessage({ message });
  return result.text || "No response";
}

/**
 * Vision
 */
export async function vision(base64Image, prompt, mimeType = "image/jpeg") {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
        { text: prompt || "Describe this image in detail." },
      ],
    },
  });

  return response.text || "No analysis available";
}

/**
 * Image generation
 */
export async function imageGen(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [{ text: prompt }],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  return null;
}

/**
 * Search grounding
 */
export async function search(query) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "No results found.";

  const chunks =
    response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  const sources = chunks
    .filter((c) => c.web)
    .map((c) => ({
      title: c.web.title || "Source",
      uri: c.web.uri || "#",
    }));

  return { text, sources };
}
