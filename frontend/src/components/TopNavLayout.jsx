import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Clock, LogOut, Shield, Menu, X } from 'lucide-react';

export default function TopNavLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const doctorLinks = [
    { name: 'Dashboard', path: '/doctor-dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Submit ADR', path: '/submit-adr', icon: <FileText className="w-4 h-4" /> },
    { name: 'Follow-Ups', path: '/follow-up', icon: <Clock className="w-4 h-4" /> },
  ];

  const analystLinks = [
    { name: 'Dashboard', path: '/analyst-dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  const links = user.role === 'Doctor' ? doctorLinks : analystLinks;

  return (
    <div className="min-h-screen bg-bg-light font-sans flex flex-col">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 w-full">
            
            {/* Logo area */}
            <div className="flex items-center gap-2 text-primary-600 shrink-0">
              <Shield className="w-7 h-7" />
              <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">VigiSense</Link>
            </div>

            {/* Desktop Center Links */}
            <div className="hidden md:flex flex-1 justify-center space-x-2">
              {links.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path + '/'));
                return (
                  <Link 
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors font-medium text-sm ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right User Area */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <Link to="/profile" className="flex flex-col items-end hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer group">
                <span className="text-sm font-bold text-slate-800 leading-tight group-hover:text-primary-600 transition-colors">{user.name}</span>
                <span className="text-xs text-slate-500 font-medium">{user.role}</span>
              </Link>
              <div className="h-8 w-px bg-slate-200"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors font-semibold text-sm text-slate-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-primary-500">
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
            
          </div>
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-100">
              {links.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path + '/'));
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium text-base ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:translate-x-1 hover:text-slate-900 transition-transform'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                );
              })}
            </div>
            <div className="pt-4 pb-3 border-t border-slate-200">
              <div className="flex items-center px-5">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                    {user.name.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-slate-800">{user.name}</div>
                  <div className="text-sm font-medium leading-none text-slate-500 mt-1">{user.role}</div>
                </div>
              </div>
              <div className="mt-1 px-2 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium rounded-md text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-5 h-5" />
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium rounded-md text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto">
        {children}
      </main>
      
    </div>
  );
}
