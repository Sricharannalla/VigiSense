import { classifySeverity } from './services/aiService.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const scenarios = [
    {
      reactionDescription: "Minor skin rash with slight itching.",
      hospitalization: false,
      outcome: "Resolved",
      clinicalNotes: "Patient took Benadryl at home."
    },
    {
      reactionDescription: "Severe chest pain and shortness of breath.",
      hospitalization: true,
      outcome: "Recovering",
      clinicalNotes: "Admitted to ICU for observation."
    }
  ];

  for (const scenario of scenarios) {
    console.log(`Checking scenario: ${scenario.reactionDescription}`);
    const result = await classifySeverity(scenario);
    console.log('Classified as:', JSON.stringify(result, null, 2));
    console.log('---');
  }
  process.exit(0);
}

test();
