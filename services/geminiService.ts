
import { GoogleGenAI } from "@google/genai";
import { fileToGenerativePart } from '../utils/fileUtils';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processDocument = async (file: File): Promise<string> => {
  const imagePart = await fileToGenerativePart(file);

  const prompt = `You are an expert document processor and translator for a publishing house specializing in academic materials for competitive exams in India. Your task is to process a UPSC General Studies question paper for a bilingual book.

  Follow these instructions precisely:
  1.  Analyze the provided document file (which could be an image or a multi-page PDF) of a UPSC General Studies question paper.
  2.  Identify all text content, meticulously preserving the original structure, including numbering (e.g., Q.1., Q.2.), question order, alignment, marks (e.g., 12½), and spacing. If the document is multi-page, process all pages in order.
  3.  The paper contains text in both English and Devanagari script (Hindi).
  4.  Keep all English text absolutely unchanged.
  5.  Translate all Hindi text into Marathi. The translation must be accurate, formal, and contextually appropriate for an examination paper. Maintain the original meaning and nuance.
  6.  Combine the original English text and the newly translated Marathi text into a single, cohesive document that perfectly mirrors the layout and format of the original paper.
  7.  The final output must be clean, well-formatted plain text, ready for direct inclusion into a book. Do not add any commentary, notes, or extra text that was not in the original paper.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: { parts: [imagePart, { text: prompt }] },
  });

  return response.text;
};
