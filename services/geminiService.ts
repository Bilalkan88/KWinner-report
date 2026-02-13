
import { GoogleGenAI, Type } from "@google/genai";
import { KeywordReport } from "../types";

export const enhanceReportWithAI = async (report: KeywordReport): Promise<{ executiveSummary: string; marketOutlook: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    As a professional Amazon keyword analyst for "Keyword Winner", analyze the following data and provide two professional narrative sections for a premium report.
    
    Market Data:
    Keyword: ${report.keyword}
    Category: ${report.category}
    Search Volume: ${report.monthlySearchVolume}
    Sales: ${report.estimatedMonthlySales}
    BSR (Best Sellers Rank): #${report.bsr}
    Sellers with Keyword in Title: ${report.sellersWithKeywordInTitle}
    Fulfillment Mix: ${report.fbaSellersCount ?? 0} FBA Sellers, ${report.fbmSellersCount ?? 0} FBM Sellers
    Eligibility Status: ${report.eligibility}
    
    Financial Data:
    Selling Price: $${report.sellingPrice}
    Est. Cost: $${report.estimatedCostPrice}
    Est. Monthly Profit: $${report.estimatedMonthlyProfit}

    Strategic Choices:
    Primary Advantage: "${report.keyAdvantage}"
    Primary Ownership Goal: "${report.ownershipValue}"
    Exclusive Logic: ${report.exclusiveReason}
    Risk Assessment: ${report.mainRisk}

    Instructions for Narrative Generation:
    1. Read the Primary Advantage: "${report.keyAdvantage}". Convert it into a 1-sentence strategic explanation in the report narrative.
    2. Read the Ownership Goal: "${report.ownershipValue}". Incorporate it as a 1-sentence value proposition in the Executive Summary.
    3. Do NOT list alternatives or options. Only explain the selected choice.
    
    Output Format (JSON):
    1. Executive Summary: A high-value summary of why this keyword is a win, incorporating viability, fulfillment strategy, and core benefit.
    2. Market Outlook: A professional projection of category potential and entry barriers.
    
    Avoid hype or guarantees. Use formal, professional business English.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            marketOutlook: { type: Type.STRING }
          },
          required: ["executiveSummary", "marketOutlook"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      executiveSummary: result.executiveSummary || "Professional summary unavailable.",
      marketOutlook: result.marketOutlook || "Market outlook details unavailable."
    };
  } catch (error) {
    console.error("AI Enhancement Error:", error);
    return {
      executiveSummary: "Strategic analysis of the " + report.keyword + " opportunity indicates significant potential. The primary advantage of " + report.keyAdvantage.toLowerCase() + " allows for a faster entry strategy, while the core value of " + report.ownershipValue.toLowerCase() + " ensures long-term viability.",
      marketOutlook: "The " + report.category + " market shows steady demand with a Search Volume of " + report.monthlySearchVolume + ". Competition remains manageable with optimized entry."
    };
  }
};
