import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDashboard from './pages/DoctorDashboard';
import AnalystDashboard from './pages/AnalystDashboard';
import ADRSubmission from './pages/ADRSubmission';
import FollowUpQuestions from './pages/FollowUpQuestions';
import FollowUpsList from './pages/FollowUpsList';
import Profile from './pages/Profile';
import TopNavLayout from './components/TopNavLayout';

function App() {
  return (
    <div className="min-h-screen font-sans bg-bg-light">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes wrapped in TopNavLayout */}
        <Route path="/doctor-dashboard" element={<TopNavLayout><DoctorDashboard /></TopNavLayout>} />
        <Route path="/submit-adr" element={<TopNavLayout><ADRSubmission /></TopNavLayout>} />
        <Route path="/follow-up" element={<TopNavLayout><FollowUpsList /></TopNavLayout>} />
        <Route path="/follow-up/:id" element={<TopNavLayout><FollowUpQuestions /></TopNavLayout>} />
        <Route path="/profile" element={<TopNavLayout><Profile /></TopNavLayout>} />
        
        <Route path="/analyst-dashboard" element={<TopNavLayout><AnalystDashboard /></TopNavLayout>} />
      </Routes>
    </div>
  );
}

export default App;
