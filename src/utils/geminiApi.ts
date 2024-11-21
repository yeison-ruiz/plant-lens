import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY no está configurado en .env.local");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function identifyPlant(imageFile: File): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imageBytes = await imageFile.arrayBuffer();

    const prompt = "Identifica esta planta y proporciona información clave sobre ella, incluyendo su nombre común, nombre científico y una breve descripción de sus características y requisitos de cuidado. Por favor, responde en español.";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: Buffer.from(imageBytes).toString('base64')
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("No se recibió texto en la respuesta");
    }

    return text;
  } catch (error) {
    let errorMessage = "No se pudo identificar la planta: Ocurrió un error desconocido";
    if (error instanceof Error) {
      errorMessage = `No se pudo identificar la planta: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
}

