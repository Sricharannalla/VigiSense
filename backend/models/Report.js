import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientAge: { type: Number },
  gender: { type: String },
  drugName: { type: String, required: true },
  dosage: { type: String },
  reactionDescription: { type: String, required: true },
  seriousnessLevel: { type: String, enum: ['Mild', 'Moderate', 'Severe', 'Fatal'], required: true },
  outcome: { type: String },
  clinicalNotes: { type: String },
  hospitalization: { type: Boolean, default: false },
  riskScore: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['Low Risk', 'Medium Risk', 'High Risk'], default: 'Low Risk' },
  aiSeverity: { type: String, enum: ['Mild', 'Moderate', 'Severe', 'Life-Threatening', 'Fatal'] },
  aiSeverityExplanation: { type: String },
  aiFollowUpQuestions: [{ type: String }],
  followUpAnswers: { type: Map, of: String },
  status: { type: String, enum: ['Pending Follow-Up', 'Complete'], default: 'Complete' },
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
