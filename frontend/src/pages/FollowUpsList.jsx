import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, AlertCircle, FileText, ChevronRight, Brain } from 'lucide-react';

export default function FollowUpsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Doctor') {
      navigate('/login');
      return;
    }

    const fetchPendingFollowUps = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reports/doctor/${user.id}`);
        // Filter only the reports that require follow-up
        const pending = res.data.filter(r => r.status === 'Pending Follow-Up');
        setReports(pending);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingFollowUps();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-bg-light p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link to="/doctor-dashboard" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">AI Follow-Up Requests</h1>
              <p className="text-slate-600 mt-1">Our AI Engine identified missing crucial safety information in the following reports.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="card text-center p-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full mb-4"></div>
              <div className="text-slate-500 font-medium">Loading requests...</div>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="card text-center p-16 border border-slate-100 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">You're all caught up!</h3>
            <p className="text-slate-500 max-w-md">There are no pending AI follow-up requests for your submitted Adverse Drug Reaction reports.</p>
            <Link to="/submit-adr" className="btn-primary mt-8">Submit New ADR</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report._id} className="card border-l-4 border-l-amber-500 hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Action Required
                      </span>
                      <span className="text-sm font-medium text-slate-500">
                        Submitted on {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{report.drugName}</h3>
                    <p className="text-slate-600 line-clamp-2 text-sm">{report.reactionDescription}</p>

                    <div className="mt-4 flex gap-4">
                      <div className="bg-slate-50 rounded text-xs font-semibold text-slate-600 px-3 py-1.5 border border-slate-100">
                        Severity: <span className="text-slate-900 ml-1">{report.seriousnessLevel}</span>
                      </div>
                      <div className="bg-slate-50 rounded text-xs font-semibold text-slate-600 px-3 py-1.5 border border-slate-100">
                        Missing Fields: <span className="text-red-500 font-bold ml-1">{report.aiFollowUpQuestions?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  <Link to={`/follow-up/${report._id}`} className="btn-secondary whitespace-nowrap flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    Answer Questions <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
