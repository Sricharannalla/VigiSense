import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Create Gemini instance
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

export const analyzeADR = async (reportData) => {
  let riskScore = 0;
  
  // Severe reaction = +40
  if (['Severe', 'Fatal'].includes(reportData.seriousnessLevel)) {
    riskScore += 40;
  } else if (reportData.seriousnessLevel === 'Moderate') {
    riskScore += 20;
  }

  // Hospitalization = +30
  if (reportData.hospitalization) {
    riskScore += 30;
  }

  // Missing dosage = +10
  if (!reportData.dosage) { riskScore += 10; }

  // Missing patient age = +10
  if (!reportData.patientAge) { riskScore += 10; }

  // Now query Gemini for follow up questions
  try {
    const prompt = `You are a pharmacovigilance safety expert.
Analyze the following adverse drug reaction report.
Identify missing safety information that is required for proper pharmacovigilance investigation.
Generate follow-up questions to collect the missing information.
Return the output as a clean, simple, unnumbered list of questions separated by newlines. DO NOT include introductory text, bullet points, or markdown. Only the questions themselves.

ADR Report Data:
- Drug: ${reportData.drugName}
- Dosage: ${reportData.dosage || 'Not Provided'}
- Patient Age: ${reportData.patientAge || 'Not Provided'}
- Patient Gender: ${reportData.gender}
- Reaction Description: ${reportData.reactionDescription}
- Seriousness Level: ${reportData.seriousnessLevel}
- Hospitalization: ${reportData.hospitalization ? 'Yes' : 'Not stated'}
- Outcome: ${reportData.outcome || 'Not Provided'}
- Additional Notes: ${reportData.clinicalNotes || 'None'}
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    const outputText = response.text;
    
    // Split the text block into array of questions
    const questions = outputText.split('\n')
        .map(q => q.trim().replace(/^[-*•\d.)]\s*/, '')) // Remove bullets or numbers just in case 
        .filter(q => q.length > 5);

    const status = questions.length > 0 ? 'Pending Follow-Up' : 'Complete';
    
    return { riskScore, questions, status };

  } catch (error) {
    console.error("Gemini AI API Error:", error);
    // Fallback to basic heuristics if API fails
    const fallbackQuestions = [];
    if (!reportData.dosage) fallbackQuestions.push("What was the exact dosage of the drug administered?");
    if (!reportData.patientAge) fallbackQuestions.push("What is the patient's age?");
    if (!reportData.outcome) fallbackQuestions.push("What was the outcome of the reaction/treatment?");
    if (['Severe', 'Fatal'].includes(reportData.seriousnessLevel) && reportData.hospitalization === undefined) {
      fallbackQuestions.push("Was the patient hospitalized due to this reaction?");
    }
    return { riskScore, questions: fallbackQuestions, status: fallbackQuestions.length > 0 ? 'Pending Follow-Up' : 'Complete' };
  }
};
