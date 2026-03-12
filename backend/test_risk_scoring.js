import { analyzeADR } from './services/aiService.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const scenarios = [
    {
      reactionDescription: "Minor rash",
      aiSeverity: "Mild",
      hospitalization: false,
      dosage: "10mg",
      patientAge: 45
    },
    {
      reactionDescription: "Severe anaphylaxis",
      aiSeverity: "Severe",
      hospitalization: true,
      dosage: null,
      patientAge: 30
    },
    {
      reactionDescription: "Fatal cardiac arrest",
      aiSeverity: "Fatal",
      hospitalization: true,
      dosage: null,
      patientAge: null
    }
  ];

  for (const s of scenarios) {
    const result = await analyzeADR(s);
    console.log(`Scenario: ${s.reactionDescription}`);
    console.log(`Score: ${result.riskScore}, Level: ${result.riskLevel}`);
    console.log('---');
  }
  process.exit(0);
}

test();
