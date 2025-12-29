/*import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
    baseURL: process.env.OpenAI_BASE_URL,
});*/
import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);