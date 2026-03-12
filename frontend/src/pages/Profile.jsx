import React, { useState } from 'react';
import { User, Mail, Shield, Award, Edit2, Save, X } from 'lucide-react';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  // Dummy editable state for future expansion
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    department: user.role === 'Doctor' ? 'Cardiology (Demo)' : 'Pharmacovigilance Risk Assessment',
    phone: '',
    bio: ''
  });

  const handleSave = () => {
    // Ideally this would make a PUT request to update the user in DB
    setIsEditing(false);
    // User info like name/email is stored in token/localStorage, in a real scenario you'd refresh it.
  };

  return (
    <div className="min-h-screen bg-bg-light p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">Manage your account settings and personal information.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Cover Photo Area */}
          <div className="h-32 bg-linear-to-r from-primary-500 to-secondary-500"></div>
          
          <div className="px-8 pb-8 relative">
            {/* Avatar & Actions */}
            <div className="flex justify-between items-start">
              <div className="relative -mt-16 mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-primary-100 flex items-center justify-center text-4xl font-bold text-primary-700 shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-400 hover:text-primary-600 cursor-pointer transition-colors">
                  <Edit2 className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="btn-secondary px-4 py-2">
                      <X className="w-4 h-4 mr-2 inline" /> Cancel
                    </button>
                    <button onClick={handleSave} className="btn-primary px-4 py-2">
                      <Save className="w-4 h-4 mr-2 inline" /> Save Changes
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="btn-secondary px-4 py-2">
                    <Edit2 className="w-4 h-4 mr-2 inline" /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="grid md:grid-cols-2 gap-12">
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{user.name}</h2>
                  <div className="flex items-center gap-2 text-primary-600 font-medium">
                    {user.role === 'Doctor' ? <Award className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    {user.role}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">Full Name</label>
                    {isEditing ? (
                      <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    ) : (
                      <p className="text-slate-800 font-medium">{formData.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">Email Address</label>
                    {isEditing ? (
                      <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    ) : (
                      <div className="flex items-center gap-2 text-slate-800 font-medium">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {formData.email}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1">Department / Organization</label>
                    {isEditing ? (
                      <input type="text" className="input-field" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                    ) : (
                      <p className="text-slate-800 font-medium">{formData.department}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Account Overview</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Role Level</span>
                      <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">{user.role} Access</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Account Status</span>
                      <span className="text-slate-800 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-500 font-medium">Member Since</span>
                      <span className="text-slate-800 font-semibold">March 2026</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
