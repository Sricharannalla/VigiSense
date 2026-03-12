import express from 'express';
import Report from '../models/Report.js';
import { analyzeADR, classifySeverity } from '../services/aiService.js';

const router = express.Router();

// Middleware to check auth would go here in production

// Submit ADR Report (Doctor)
router.post('/', async (req, res) => {
  try {
    const reportData = req.body;
    
    // 1. AI Severity Classification FIRST (needed for risk scoring)
    const { severity, explanation } = await classifySeverity(reportData);
    
    // 2. AI Missing Info Detection, Risk Scoring, and Level calculation
    const reportWithSeverity = { ...reportData, aiSeverity: severity };
    const { riskScore, riskLevel, questions, status } = await analyzeADR(reportWithSeverity);
    
    const newReport = new Report({
      ...reportData,
      riskScore,
      riskLevel,
      aiSeverity: severity,
      aiSeverityExplanation: explanation,
      aiFollowUpQuestions: questions,
      status
    });

    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all reports (Analyst)
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().populate('doctorId', 'name email');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reports by doctor
router.get('/doctor/:id', async (req, res) => {
  try {
    const reports = await Report.find({ doctorId: req.params.id });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit follow up answers (Doctor)
router.put('/:id/followup', async (req, res) => {
  try {
    const { answers } = req.body; // Expecting { question: answer } object
    
    // We assume submitting any follow-ups marks the status Complete for simplicity in MVP
    const updated = await Report.findByIdAndUpdate(
      req.params.id, 
      { 
        $set: { followUpAnswers: answers, status: 'Complete' }
      }, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
