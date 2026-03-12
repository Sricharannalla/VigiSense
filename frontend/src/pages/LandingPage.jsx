import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Clock, Activity, AlertCircle, FileText, CheckCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-light font-sans selection:bg-primary-100">
      
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-600">
            <Shield className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">VigiSense</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How It Works</a>
            <a href="#solutions" className="hover:text-primary-600 transition-colors">Solutions</a>
            <a href="#impact" className="hover:text-primary-600 transition-colors">Impact</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="font-semibold text-slate-600 hover:text-primary-600 hidden sm:block">Log In</Link>
            <Link to="/register" className="btn-primary py-2.5">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl aspect-square bg-primary-50 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-50 text-accent-600 font-medium text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
            Next-Gen Pharmacovigilance
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight mb-8">
            AI-Powered Pharmacovigilance <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-500 to-secondary-500">
              Follow-Up System
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Automatically detect missing safety information in adverse drug reports and generate targeted follow-up questions to improve drug safety monitoring.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-slate-900">The Problem: Incomplete Data Delays Safety Responses</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Many adverse drug reaction (ADR) reports are submitted with missing critical information—such as precise dosages, patient demographics, or definitive outcomes. 
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              This lack of comprehensive data forces pharmacovigilance teams into slow, manual follow-up loops, radically delaying potential drug safety investigations and endangering patient outcomes.
            </p>
            <div className="flex items-center gap-4 text-red-600 font-semibold bg-red-50 p-4 rounded-xl border border-red-100">
              <AlertCircle className="w-6 h-6" />
              <p>Over 40% of initial ADR reports require manual follow-up.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-tr from-primary-100 to-secondary-50 rounded-3xl transform rotate-3" />
            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100 h-full flex flex-col justify-center gap-6">
              <div className="flex gap-4 opacity-50">
                <div className="w-12 h-12 bg-slate-100 rounded-full" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="border border-red-200 bg-red-50 rounded-xl p-4 flex gap-4">
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Missing Safety Information Detected</h4>
                  <p className="text-red-700 text-sm">Vital fields 'Dosage' and 'Outcome' are missing from report ID-8942.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solutions" className="py-24 px-6 bg-bg-light relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">The Solution: Intelligent Intervention</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            VigiSense analyzes ADR reports using advanced AI instantaneously. It detects missing safety information contextually and generates follow-up questions automatically—closing the loop before delays occur.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 relative z-10">
          <div className="card hover:-translate-y-1">
            <Brain className="w-12 h-12 text-primary-500 mb-6" />
            <h3 className="text-xl font-bold mb-4 text-slate-900">Contextual Parsing</h3>
            <p className="text-slate-600">NLP-driven extraction understands clinical narratives to accurately spot omitted data points.</p>
          </div>
          <div className="card hover:-translate-y-1">
            <Clock className="w-12 h-12 text-primary-500 mb-6" />
            <h3 className="text-xl font-bold mb-4 text-slate-900">Zero-Delay Follow-Ups</h3>
            <p className="text-slate-600">Reporters and analysts are prompted instantaneously to clarify report ambiguities while the case is fresh.</p>
          </div>
          <div className="card hover:-translate-y-1">
            <Activity className="w-12 h-12 text-primary-500 mb-6" />
            <h3 className="text-xl font-bold mb-4 text-slate-900">Dynamic Risk Scoring</h3>
            <p className="text-slate-600">Assign priority to cases based on severity and missing information volume, directing analysts where they are needed most.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto leading-relaxed">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">How It Works</h2>
            <p className="text-xl text-slate-600">A seamless workflow from submission to resolution.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative text-center group">
              <div className="w-20 h-20 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors text-primary-600">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900">Submits Report</h4>
              <p className="text-slate-600">A doctor or healthcare provider submits an initial ADR report via our intuitive interface.</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-slate-200 -z-10" />
            </div>

            <div className="relative text-center group">
              <div className="w-20 h-20 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors text-primary-600">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900">AI Analysis</h4>
              <p className="text-slate-600">The VigiSense Engine scans the submission to detect any missing critical safety parameters.</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-slate-200 -z-10" />
            </div>

            <div className="relative text-center group">
              <div className="w-20 h-20 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors text-primary-600">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900">Follow-Up Gen</h4>
              <p className="text-slate-600">Customized follow-up questions are instantly presented to prompt the reporter for more data.</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-slate-200 -z-10" />
            </div>

            <div className="relative text-center group">
              <div className="w-20 h-20 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors text-primary-600">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h4 className="text-xl font-bold mb-3 text-slate-900">Analyst Review</h4>
              <p className="text-slate-600">Pharmacovigilance analysts monitor sorted, high-priority cases from a centralized dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-8">Measurable Impact on Patient Safety</h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-accent-500/20 p-2 rounded-lg text-accent-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Faster Monitoring</h4>
                  <p className="text-slate-400">Decrease the time to evaluate a signal by generating actionable data upfront.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-accent-500/20 p-2 rounded-lg text-accent-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Reduced Manual Overhead</h4>
                  <p className="text-slate-400">Free your analysts from sending routine follow-up emails so they can focus on complex cases.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-accent-500/20 p-2 rounded-lg text-accent-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Improved Patient Safety</h4>
                  <p className="text-slate-400">Identify severe risk profiles quicker with our intelligent scoring algorithm.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-[400px] card bg-slate-800 border-slate-700">
            <div className="text-center pb-8 border-b border-slate-700">
              <h3 className="text-5xl font-extrabold text-blue-400 mb-2">99%</h3>
              <p className="text-slate-300 font-medium">Better Pharmacovigilance Reporting Compliance</p>
            </div>
            <div className="pt-8 text-center text-slate-400 font-medium">
              Transform your pharmacovigilance operations today.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-primary-600">
            <Shield className="w-6 h-6" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">VigiSense</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} VigiSense Healthcare Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
