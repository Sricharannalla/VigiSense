import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Stethoscope, AlertTriangle } from 'lucide-react';

export default function ADRSubmission() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientAge: '',
    gender: 'Male',
    drugName: '',
    dosage: '',
    reactionDescription: '',
    seriousnessLevel: 'Mild',
    outcome: '',
    clinicalNotes: '',
    hospitalization: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) navigate('/login');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const payload = {
        ...formData,
        doctorId: user.id,
        patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
      };

      const res = await axios.post('http://localhost:5000/api/reports', payload);

      if (res.data.status === 'Pending Follow-Up') {
        navigate(`/follow-up/${res.data._id}`);
      } else {
        navigate('/doctor-dashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <Link to="/doctor-dashboard" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary-600">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Submit ADR Report</h1>
              <p className="text-slate-600 mt-1">Record a new Adverse Drug Reaction. AI will analyze this for missing information.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-8">

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Patient Demographics</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Patient Age <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input type="number" value={formData.patientAge} onChange={e => setFormData({ ...formData, patientAge: e.target.value })} className="input-field" placeholder="e.g. 45" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="input-field bg-white">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Drug Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Drug Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.drugName} onChange={e => setFormData({ ...formData, drugName: e.target.value })} className="input-field" required placeholder="e.g. Lisinopril" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Dosage <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input type="text" value={formData.dosage} onChange={e => setFormData({ ...formData, dosage: e.target.value })} className="input-field" placeholder="e.g. 10mg daily" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Reaction Details</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reaction Description <span className="text-red-500">*</span></label>
              <textarea value={formData.reactionDescription} onChange={e => setFormData({ ...formData, reactionDescription: e.target.value })} className="input-field h-28 resize-none" required placeholder="Provide a detailed description of the adverse event..."></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Seriousness Level <span className="text-red-500">*</span></label>
                <select value={formData.seriousnessLevel} onChange={e => setFormData({ ...formData, seriousnessLevel: e.target.value })} className="input-field bg-white">
                  <option>Mild</option>
                  <option>Moderate</option>
                  <option>Severe</option>
                  <option>Fatal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Outcome <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input type="text" value={formData.outcome} onChange={e => setFormData({ ...formData, outcome: e.target.value })} className="input-field" placeholder="e.g. Recovering" />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
                  <input type="checkbox" checked={formData.hospitalization} onChange={e => setFormData({ ...formData, hospitalization: e.target.checked })} className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500" />
                  Patient required hospitalization
                </label>
                <p className="text-xs text-slate-500 mt-1 pl-6">Check this if the adverse reaction directly resulted in inpatient hospitalization or prolongation of existing hospitalization.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Clinical Notes <span className="text-slate-400 font-normal">(Optional)</span></label>
              <textarea value={formData.clinicalNotes} onChange={e => setFormData({ ...formData, clinicalNotes: e.target.value })} className="input-field h-24 resize-none" placeholder="Any additional clinical context or relevant medical history..."></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto px-10 py-3.5 text-lg">
              {loading ? 'Analyzing with AI...' : 'Submit ADR Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
