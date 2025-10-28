
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Sale, GeminiAnalysisResult, CategoryKey } from '../types';
import { CATEGORY_LIST } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string; } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("Failed to read file as base64 string"));
      }
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const analyzeProductImage = async (imageFile: File): Promise<GeminiAnalysisResult> => {
  const imagePart = await fileToGenerativePart(imageFile);
  const categoriesText = CATEGORY_LIST.map(c => c.key).join(', ');

  const prompt = `Analyze the attached image of a product from a sari-sari store in the Philippines. Identify the product name, and suggest a category from this list: [${categoriesText}]. Also, suggest a typical cost price and selling price in Philippine Pesos (PHP). Return the response as a single JSON object.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: 'The full name of the product.' },
                category: { type: Type.STRING, description: `The category from the provided list.`, enum: CATEGORY_LIST.map(c => c.key) },
                costPrice: { type: Type.NUMBER, description: 'The estimated cost price in PHP.' },
                sellingPrice: { type: Type.NUMBER, description: 'The estimated selling price in PHP.' },
            },
            required: ['name', 'category', 'costPrice', 'sellingPrice'],
        },
      },
    });

    const parsed = JSON.parse(response.text);
    // Ensure category is valid, default to 'other' if not
    const validCategory = CATEGORY_LIST.some(c => c.key === parsed.category) ? parsed.category as CategoryKey : 'other';
    
    return {
        ...parsed,
        category: validCategory,
    };
  } catch (error) {
    console.error("Gemini image analysis failed:", error);
    throw new Error("Could not analyze the product image. Please try again.");
  }
};

export const getDashboardInsights = async (inventory: Product[], sales: Sale[]): Promise<{ topSelling: string; profitAnalysis: string; aiRecommendations: string; }> => {
    const relevantInventory = inventory.slice(0, 20).map(p => ({
        name: p.name,
        stock: p.stock,
        totalSold: p.totalSold,
        costPrice: p.costPrice,
        sellingPrice: p.sellingPrice,
        lastSold: p.lastSold
    }));

    const relevantSales = sales.slice(-50).map(s => ({
        productName: s.productName,
        profit: s.profit,
        timestamp: s.timestamp
    }));

    const prompt = `
        You are a business analyst for a small convenience store (sari-sari store) in the Philippines. Based on the following inventory and sales data, provide actionable recommendations and insights.

        Today's Date: ${new Date().toDateString()}

        Inventory Data (sample):
        ${JSON.stringify(relevantInventory, null, 2)}

        Recent Sales Data (sample):
        ${JSON.stringify(relevantSales, null, 2)}

        Task: Provide a JSON object with three keys: "topSelling", "profitAnalysis", and "aiRecommendations".
        - "topSelling": A brief paragraph highlighting the 3 best-selling products.
        - "profitAnalysis": A brief paragraph analyzing the most profitable items or categories.
        - "aiRecommendations": A brief, actionable suggestion for the store owner.

        Return ONLY the JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topSelling: { type: Type.STRING },
                        profitAnalysis: { type: Type.STRING },
                        aiRecommendations: { type: Type.STRING },
                    },
                    required: ['topSelling', 'profitAnalysis', 'aiRecommendations'],
                }
            }
        });

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Gemini dashboard insights failed:", error);
        throw new Error("Could not generate AI insights. Please try again later.");
    }
};
