import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { AlertCircle, Filter, Activity, CheckCircle, ShieldAlert } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

export default function AnalystDashboard() {
  const [reports, setReports] = useState([]);
  
  // Filters
  const [filterDrug, setFilterDrug] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Analyst') {
      navigate('/login');
      return;
    }
    const fetchReports = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reports');
        setReports(res.data.sort((a, b) => b.riskScore - a.riskScore));
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  // Compute Filtered Reports
  const filteredReports = reports.filter(r => {
    const matchDrug = filterDrug ? r.drugName.toLowerCase().includes(filterDrug.toLowerCase()) : true;
    const matchSeverity = filterSeverity ? r.seriousnessLevel === filterSeverity : true;
    const matchDate = filterDate ? new Date(r.createdAt).toISOString().split('T')[0] === filterDate : true;
    return matchDrug && matchSeverity && matchDate;
  });

  const highRiskReports = reports.filter(r => r.riskLevel === 'High Risk');

  // Chart Data: Risk Score Distribution
  const riskGroups = { 'Low (0-20)': 0, 'Medium (21-50)': 0, 'High (51-79)': 0, 'Critical (80+)': 0 };
  filteredReports.forEach(r => {
    if (r.riskScore <= 20) riskGroups['Low (0-20)']++;
    else if (r.riskScore <= 50) riskGroups['Medium (21-50)']++;
    else if (r.riskScore < 80) riskGroups['High (51-79)']++;
    else riskGroups['Critical (80+)']++;
  });

  const riskScoreData = {
    labels: Object.keys(riskGroups),
    datasets: [{
      label: 'Reports',
      data: Object.values(riskGroups),
      backgroundColor: ['#22c55e', '#eab308', '#f97316', '#ef4444'],
      borderWidth: 0,
    }]
  };

  // Chart Data: Follow-up Completion Rate
  const followUpCounts = { 'Complete': 0, 'Pending Follow-Up': 0 };
  filteredReports.forEach(r => {
    followUpCounts[r.status] = (followUpCounts[r.status] || 0) + 1;
  });

  const completionData = {
    labels: Object.keys(followUpCounts),
    datasets: [{
      data: Object.values(followUpCounts),
      backgroundColor: ['#22c55e', '#cbd5e1'],
      borderWidth: 0,
      cutout: '70%',
    }]
  };

  // Chart Data: Top Drugs
  const drugCounts = {};
  filteredReports.forEach(r => {
    drugCounts[r.drugName] = (drugCounts[r.drugName] || 0) + 1;
  });
  const topDrugs = Object.entries(drugCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const topDrugsData = {
    labels: topDrugs.map(d => d[0]),
    datasets: [{
      label: 'Incident Count',
      data: topDrugs.map(d => d[1]),
      backgroundColor: '#3b82f6',
      borderRadius: 4,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
    }
  };

  return (
    <div className="min-h-screen bg-bg-light p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Pharmacovigilance Analyst Dashboard</h1>
          <p className="text-slate-600">Monitor ADR reports, assess high-risk cases, and track follow-up compliance.</p>
        </div>

        {/* High-Risk Alerts */}
        {highRiskReports.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 relative overflow-hidden">
            <ShieldAlert className="absolute -right-4 -top-4 w-32 h-32 text-red-500/10" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-red-100 text-red-600 p-3 rounded-xl shrink-0">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-900 mb-2">Critical High-Risk Cases Detected</h2>
                <p className="text-red-800 mb-4 max-w-3xl">
                  There are <strong>{highRiskReports.length}</strong> reports with a Risk Score of 80 or above requiring immediate review.
                </p>
                <div className="flex flex-wrap gap-2">
                  {highRiskReports.slice(0, 3).map(r => (
                    <span key={r._id} className="px-3 py-1.5 bg-white rounded-lg border border-red-200 text-sm font-semibold text-red-800 flex items-center gap-2">
                      {r.drugName} <span className="bg-red-100 px-2 py-0.5 rounded text-red-700">Score: {r.riskScore}</span>
                    </span>
                  ))}
                  {highRiskReports.length > 3 && (
                    <span className="px-3 py-1.5 text-sm font-medium text-red-700">+{highRiskReports.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Risk Score Distribution</h3>
            <div className="flex-1 min-h-[250px] relative">
              <Bar data={riskScoreData} options={{...chartOptions, plugins: { legend: { display: false }}}} />
            </div>
          </div>

          <div className="card flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Follow-up Completion Rate</h3>
            <div className="flex-1 min-h-[250px] relative flex flex-col items-center justify-center">
              <div className="h-48 w-full">
                <Doughnut data={completionData} options={chartOptions} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none mb-8">
                <span className="text-3xl font-extrabold text-slate-900">
                  {filteredReports.length > 0 ? Math.round((followUpCounts['Complete'] || 0) / filteredReports.length * 100) : 0}%
                </span>
                <span className="text-sm font-medium text-slate-500">Completed</span>
              </div>
            </div>
          </div>

          <div className="card flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Top Drugs with Incidents</h3>
            <div className="flex-1 min-h-[250px] relative">
              <Bar data={topDrugsData} options={{...chartOptions, indexAxis: 'y', plugins: { legend: { display: false }}}} />
            </div>
          </div>
        </div>

        {/* Filters and Table Section */}
        <div className="card p-0 overflow-hidden flex flex-col h-full">
          {/* Filters */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Filter by Drug</label>
                <input type="text" value={filterDrug} onChange={e => setFilterDrug(e.target.value)} placeholder="e.g. Lisinopril" className="input-field bg-white" />
              </div>
              <div className="w-full md:w-48">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Severity</label>
                <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} className="input-field bg-white">
                  <option value="">All Severities</option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Fatal">Fatal</option>
                </select>
              </div>
              <div className="w-full md:w-48">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date Submitted</label>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="input-field bg-white" />
              </div>
              <button 
                onClick={() => { setFilterDrug(''); setFilterSeverity(''); setFilterDate(''); }}
                className="btn-secondary h-[50px] flex items-center gap-2 whitespace-nowrap"
              >
                <Filter className="w-4 h-4" /> Clear
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                  <th className="p-4 font-semibold whitespace-nowrap">Drug Name</th>
                  <th className="p-4 font-semibold">Reaction</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Severity</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Risk Score</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Date Submitted</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">
                      No matching reports found. Adjust your filters or wait for new submissions.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map(report => (
                    <tr key={report._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{report.drugName}</td>
                      <td className="p-4 text-sm max-w-xs xl:max-w-md truncate" title={report.reactionDescription}>
                        {report.reactionDescription}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          (report.aiSeverity || report.seriousnessLevel) === 'Fatal' ? 'bg-red-100 text-red-800 border border-red-200' :
                          (report.aiSeverity || report.seriousnessLevel) === 'Severe' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                          (report.aiSeverity || report.seriousnessLevel) === 'Moderate' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {report.aiSeverity || report.seriousnessLevel}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className={`font-bold ${report.riskLevel === 'High Risk' ? 'text-red-600' : report.riskLevel === 'Medium Risk' ? 'text-orange-500' : 'text-green-600'}`}>
                            {report.riskScore}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                            {report.riskLevel}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {report.status === 'Pending Follow-Up' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 whitespace-nowrap">
                            <Activity className="w-3.5 h-3.5" /> Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 whitespace-nowrap">
                            <CheckCircle className="w-3.5 h-3.5" /> Complete
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-500 whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-sm text-slate-500 text-center md:text-left">
            Showing {filteredReports.length} of {reports.length} total reports
          </div>
        </div>

      </div>
    </div>
  );
}
