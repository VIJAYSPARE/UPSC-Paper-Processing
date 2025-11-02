import { GoogleGenAI } from "@google/genai";
import { fileToGenerativePart } from '../utils/fileUtils';
import mammoth from 'mammoth';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processDocument = async (file: File): Promise<{ year: number | null, content: string }> => {
  const model = 'gemini-2.5-pro'; // This model is suitable for complex document processing
  
  const docxMimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  
  let documentContentPart;
  if (file.type === docxMimeType) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    documentContentPart = { text: `Here is the document content in HTML format. Please process it according to the instructions:\n\n${result.value}` };
  } else {
    // Assume image or PDF, which gemini can handle directly
    documentContentPart = await fileToGenerativePart(file);
  }

  const prompt = `You are an expert document processor and translator for a publishing house specializing in academic materials for competitive exams in India. Your task is to process a UPSC General Studies question paper for a bilingual book.

  Follow these instructions precisely:
  1.  First, analyze the entire document to identify the year the paper was conducted. The year is usually prominent in the document.
  2.  On the very first line of your output, write ONLY the 4-digit year.
  3.  On the second line, write 'YEAR_SEPARATOR'.
  4.  After the separator, process the rest of the document. Identify all text content, meticulously preserving the original structure, including numbering (e.g., Q.1., Q.2.), question order, alignment, marks (e.g., 12½), and spacing.
  5.  The paper contains text in both English and Devanagari script (Hindi).
  6.  Keep all English text absolutely unchanged.
  7.  Translate all Hindi text into Marathi. The translation must be accurate, formal, and contextually appropriate for an examination paper.
  8.  Retain original formatting like bold and italics by using Markdown syntax (e.g., **bold text**, *italic text*).
  9.  Combine the original English text and the newly translated Marathi text into a single, cohesive document that perfectly mirrors the layout and format of the original paper.
  10. The final output (after the separator) must be clean, well-formatted Markdown, ready for direct inclusion into a book. Do not add any commentary, notes, or extra text that was not in the original paper.`;

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [documentContentPart, { text: prompt }] },
  });

  const rawText = response.text;
  const parts = rawText.split('YEAR_SEPARATOR');

  if (parts.length < 2) {
    console.warn('YEAR_SEPARATOR not found. Year detection failed for file:', file.name);
    return { year: null, content: rawText };
  }

  const yearStr = parts[0].trim();
  const year = /^\d{4}$/.test(yearStr) ? parseInt(yearStr, 10) : null;
  const content = parts[1].trim();

  return { year, content };
};