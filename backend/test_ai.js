import { analyzeADR } from './services/aiService.js';
import mongoose from 'mongoose';

async function test() {
  const dummyReport = {
    drugName: 'Lisinopril',
    dosage: '10mg',
    patientAge: 45,
    gender: 'Male',
    reactionDescription: 'Patient experienced a severe headache and dizziness two hours after taking the medication.',
    seriousnessLevel: 'Moderate',
    hospitalization: false,
    outcome: 'Recovering',
    clinicalNotes: 'Patient has a history of high blood pressure.'
  };

  console.log('Testing analyzeADR with full data...');
  const resultFull = await analyzeADR(dummyReport);
  console.log('Result:', resultFull);

  const missingReport = {
    ...dummyReport,
    dosage: '',
    patientAge: null,
    outcome: ''
  };

  console.log('\nTesting analyzeADR with missing data...');
  const resultMissing = await analyzeADR(missingReport);
  console.log('Result:', resultMissing);

  process.exit(0);
}

test();
