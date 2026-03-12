import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, FileText, AlertCircle, Activity, CheckCircle, Clock } from 'lucide-react';

export default function DoctorDashboard() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/api/reports/doctor/${user.id}`);
        setReports(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, [navigate]);

  const totalReports = reports.length;
  const pendingFollowUps = reports.filter(r => r.status === 'Pending Follow-Up').length;
  const completedReports = reports.filter(r => r.status === 'Complete').length;

  return (
    <div className="min-h-screen bg-bg-light p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Doctor Overview</h1>
            <p className="text-slate-600">Monitor your submitted Adverse Drug Reactions and pending tasks.</p>
          </div>
          <Link to="/submit-adr" className="btn-primary flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Submit ADR Report
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="card flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Total Reports</p>
              <h3 className="text-3xl font-bold text-slate-900">{totalReports}</h3>
            </div>
          </div>

          <Link to="/follow-up" className="card flex items-center gap-6 hover:-translate-y-1 transition-transform cursor-pointer border hover:border-amber-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Pending Follow-ups</p>
              <h3 className="text-3xl font-bold text-slate-900">{pendingFollowUps}</h3>
            </div>
          </Link>

          <div className="card flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-accent-50 flex items-center justify-center text-accent-600">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Completed Reports</p>
              <h3 className="text-3xl font-bold text-slate-900">{completedReports}</h3>
            </div>
          </div>
        </div>

        {/* Report History Table */}
        <div className="card p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-slate-900">ADR Report History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="p-4 font-semibold rounded-tl-xl">Report Date</th>
                  <th className="p-4 font-semibold">Drug Name</th>
                  <th className="p-4 font-semibold">Reaction</th>
                  <th className="p-4 font-semibold">Severity</th>
                  <th className="p-4 font-semibold rounded-tr-xl">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No reports submitted yet. Click "Submit ADR Report" to begin.
                    </td>
                  </tr>
                ) : (
                  reports.map(report => (
                    <tr key={report._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-sm font-medium">{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 font-semibold text-slate-900">{report.drugName}</td>
                      <td className="p-4 text-sm max-w-xs truncate" title={report.reactionDescription}>
                        {report.reactionDescription}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          report.seriousnessLevel === 'Fatal' ? 'bg-red-100 text-red-800' :
                          report.seriousnessLevel === 'Severe' ? 'bg-orange-100 text-orange-800' :
                          report.seriousnessLevel === 'Moderate' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.seriousnessLevel}
                        </span>
                      </td>
                      <td className="p-4">
                        {report.status === 'Pending Follow-Up' ? (
                          <Link to={`/follow-up/${report._id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
                            <AlertCircle className="w-3.5 h-3.5" /> Pending Follow-up
                          </Link>
                        ) : report.status === 'Complete' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent-100 text-accent-800">
                            <CheckCircle className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                            <Activity className="w-3.5 h-3.5" /> Under review
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
