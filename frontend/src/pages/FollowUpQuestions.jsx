import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Brain, Mic, MicOff } from 'lucide-react';

export default function FollowUpQuestions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(null); // stores the index of the question being recorded

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reports');
        const found = res.data.find(r => r._id === id);
        if (found) {
          setReport(found);
          const initialAnswers = {};
          found.aiFollowUpQuestions.forEach(q => initialAnswers[q] = '');
          setAnswers(initialAnswers);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReport();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/reports/${id}/followup`, { answers });
      navigate('/doctor-dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to submit answers');
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = (question, index) => {
    if (isRecording === index) {
      setIsRecording(null);
      // Stop the recognition if it's currently running
      if (window.recognition) {
        window.recognition.stop();
      }
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support Voice Dictation. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    window.recognition = recognition;

    recognition.onstart = () => {
      setIsRecording(index);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
         setAnswers(prev => ({
           ...prev,
           [question]: (prev[question] ? prev[question] + ' ' : '') + finalTranscript.trim()
         }));
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(null);
    };

    recognition.onend = () => {
      setIsRecording(null);
    };

    recognition.start();
  };

  if (!report) return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-primary-100 rounded-full mb-4"></div>
        <div className="text-slate-500 font-medium">Loading AI Analysis...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-light p-6 md:p-10 flex flex-col items-center">
      <div className="max-w-3xl w-full">

        <div className="mb-8 p-6 bg-linear-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-2xl shadow-sm relative overflow-hidden">
          <Brain className="absolute -right-4 -bottom-4 w-32 h-32 text-orange-500/10" />
          <div className="flex items-start gap-5 relative z-10">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-xl shrink-0">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-orange-900 mb-2">AI Follow-Up Required</h2>
              <p className="text-orange-800/80 leading-relaxed text-sm">
                VigiSense AI parsed your report for <strong>{report.drugName}</strong> and identified missing safety information critical for risk calculation. Please answer the questions below to finalize the submission.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-2xl font-bold text-slate-900">Required Information</h3>
            <p className="text-slate-500 mt-1">Please provide clarity on the following missing parameters.</p>
          </div>

          <div className="space-y-6">
            {report.aiFollowUpQuestions.map((question, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-100 relative group">
                <label className="flex text-lg font-bold text-slate-800 mb-3 gap-3 pr-12">
                  <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5">{idx + 1}</span>
                  {question}
                </label>
                
                <button
                  type="button"
                  onClick={() => toggleRecording(question, idx)}
                  className={`absolute top-6 right-6 p-2 rounded-full transition-all ${
                    isRecording === idx 
                      ? 'bg-red-100 text-red-600 animate-pulse ring-4 ring-red-100' 
                      : 'bg-white text-slate-400 border border-slate-200 hover:text-primary-600 hover:border-primary-200 shadow-sm'
                  }`}
                  title={isRecording === idx ? "Stop Recording" : "Start Dictation"}
                >
                  {isRecording === idx ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <textarea
                  className={`input-field h-24 bg-white transition-colors ${isRecording === idx ? 'border-red-300 ring-2 ring-red-100' : ''}`}
                  required
                  placeholder="Enter your clinical response here or use the microphone to dictate..."
                  value={answers[question]}
                  onChange={e => setAnswers({ ...answers, [question]: e.target.value })}
                ></textarea>
                
                {isRecording === idx && (
                  <p className="text-xs font-semibold text-red-500 mt-2 flex items-center gap-1.5 animate-pulse">
                     <span className="w-2 h-2 rounded-full bg-red-500"></span> Listening... Speak clearly into your microphone.
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 flex justify-end border-t border-slate-100">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8 py-3.5 text-lg w-full md:w-auto justify-center">
              <CheckCircle className="w-5 h-5" />
              {loading ? 'Finalizing Case...' : 'Submit & Complete Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
