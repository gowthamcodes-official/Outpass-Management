import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PATHS from './paths';

// Pages
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/Dashboard';
import WardenDashboard from './pages/warden/Dashboard';

// Auth hook (to check login & role)
import useAuth from './hooks/useAuth';

function App() {
  const { user, profile } = useAuth(); // profile.role = 'student' or 'warden'

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path={PATHS.login} element={<LoginPage />} />

        {/* Student Routes */}
        <Route
          path={PATHS.studentDashboard}
          element={
            user && profile?.role === 'student'
              ? <StudentDashboard />
              : <Navigate to={PATHS.login} />
          }
        />

        {/* Warden Routes */}
        <Route
          path={PATHS.wardenDashboard}
          element={
            user && profile?.role === 'warden'
              ? <WardenDashboard />
              : <Navigate to={PATHS.login} />
          }
        />

        {/* Fallback */}
        <Route path={PATHS.notFound} element={<Navigate to={PATHS.login} />} />
      </Routes>
    </Router>
  );
}

export default App;
