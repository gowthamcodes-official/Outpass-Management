// src/paths.js
// All app routes in one place - easy to change in future

const PATHS = {
  // Auth routes
  login: '/login',
  signup: '/signup',

  // Student side
  studentDashboard: '/student',
  studentOutpassForm: '/student/form',
  studentRequests: '/student/requests',

  // Warden side
  wardenDashboard: '/warden',
  wardenManageRequests: '/warden/requests',

  // Common
  notFound: '*', // 404 fallback
};

export default PATHS;
