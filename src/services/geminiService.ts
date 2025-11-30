import { GoogleGenAI, Type } from "@google/genai";
import { FinancialData } from "../types/types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g., "data:application/pdf;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeDocument = async (file: File): Promise<FinancialData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash"; // Efficient for text/document tasks

  const filePart = await fileToGenerativePart(file);

  const prompt = `
    You are an expert legal assistant for Ontario Family Law. 
    Analyze the attached document (likely an affidavit, financial statement, or court order).
    
    Extract the following information:
    1. Applicant's annual income (estimate if monthly is provided).
    2. Respondent's annual income.
    3. Monthly child support amount found in the tables or order.
    4. Monthly spousal support amount.
    5. Detect if there is any mention of ODSP (Ontario Disability Support Program) or CPP-Disability.
    6. Provide a brief compliance note summarizing the findings and any missing critical data.

    Return ONLY JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          filePart,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            applicantIncome: { type: Type.NUMBER, description: "Annual income of the applicant in CAD" },
            respondentIncome: { type: Type.NUMBER, description: "Annual income of the respondent in CAD" },
            childSupport: { type: Type.NUMBER, description: "Monthly child support amount" },
            spousalSupport: { type: Type.NUMBER, description: "Monthly spousal support amount" },
            hasODSP: { type: Type.BOOLEAN, description: "True if ODSP is mentioned/relevant" },
            hasCPP: { type: Type.BOOLEAN, description: "True if CPP Disability is mentioned" },
            complianceNotes: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of brief compliance observations"
            }
          },
          required: ["applicantIncome", "respondentIncome", "hasODSP", "hasCPP", "complianceNotes"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FinancialData;
    }
    
    throw new Error("No data returned from analysis.");
  } catch (error) {
    console.error("Analysis failed:", error);
    // Return mock data fallback if API fails (graceful degradation for demo) or throw
    // For this demo, we will throw to let the UI handle the error state
    throw error;
  }
};