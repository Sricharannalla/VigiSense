import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini model
const getModel = () => {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-pro" });
};

export const analyzeADR = async (reportData) => {
  let riskScore = 0;
  
  // Severity-based scoring
  if (['Life-Threatening', 'Fatal'].includes(reportData.aiSeverity)) {
    riskScore += 50;
  } else if (reportData.aiSeverity === 'Severe') {
    riskScore += 40;
  } else if (reportData.aiSeverity === 'Moderate') {
    riskScore += 10;
  }

  // Clinical factor scoring
  if (reportData.hospitalization) riskScore += 30;
  if (!reportData.dosage) riskScore += 10;
  if (!reportData.patientAge) riskScore += 10;

  // Final normalization and risk level
  riskScore = Math.min(riskScore, 100);
  
  let riskLevel = 'Low Risk';
  if (riskScore >= 70) riskLevel = 'High Risk';
  else if (riskScore >= 30) riskLevel = 'Medium Risk';

  try {
    const prompt = `You are a senior pharmacovigilance safety officer.
Analyze the following ADR report and generate 4-6 specific follow-up questions to fill critical gaps.
Return ONLY a list of questions separated by newlines. No numbers, no bullets.

Report:
- Drug: ${reportData.drugName}
- Gender: ${reportData.gender}
- Reaction: ${reportData.reactionDescription}
- Severity: ${reportData.seriousnessLevel}
- Hospitalization: ${reportData.hospitalization ? 'Yes' : 'No'}
- Outcome: ${reportData.outcome}
`;

    const result = await getModel().generateContent(prompt);
    const questions = result.response.text().split('\n')
      .map(q => q.trim().replace(/^[-*•\d.)]\s*/, ''))
      .filter(q => q.length > 5);

    return { riskScore, riskLevel, questions, status: questions.length > 0 ? 'Pending Follow-Up' : 'Complete' };
  } catch (error) {
    console.error("Gemini analyzeADR Error:", error.message);
    const fallback = [];
    if (!reportData.dosage) fallback.push("What was the exact dosage of the drug?");
    if (!reportData.patientAge) fallback.push("What is the patient's age?");
    return { riskScore, riskLevel, questions: fallback, status: fallback.length > 0 ? 'Pending Follow-Up' : 'Complete' };
  }
};

export const classifySeverity = async (reportData) => {
  try {
    const prompt = `Classify the severity of this ADR report as Mild, Moderate, Severe, Life-Threatening, or Fatal.
Rules:
- Mild: minor symptoms, no treatment.
- Moderate: treatment but no hospital.
- Severe: serious medical condition or hospitalization.
- Life-Threatening: immediate risk of death.
- Fatal: patient death.

Data:
Description: ${reportData.reactionDescription}
Hospitalization: ${reportData.hospitalization ? 'Yes' : 'No'}
Outcome: ${reportData.outcome}
Clinical Notes: ${reportData.clinicalNotes || 'None'}

Return response ONLY as JSON: {"severity": "...", "explanation": "..."}`;

    const result = await getModel().generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Invalid AI response format");
  } catch (error) {
    console.error("Gemini classifySeverity Error:", error.message);
    let severity = 'Moderate';
    if (reportData.hospitalization) severity = 'Severe';
    if (reportData.outcome?.toLowerCase().includes('death')) severity = 'Fatal';
    return { severity, explanation: "Heuristic classification (AI service temporarily unavailable)." };
  }
};
