import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import FloatingShape from "./components/FloatingShape";
import LoadingSpinner from "./components/LoadingSpinner";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Adminpage from "./pages/Adminpage";
import TeacherPage from "./pages/TeacherPage";
import StudentPage from "./pages/StudentPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import TeacherLoginPage from "./pages/TeacherLoginPage";
import AddStudentPage from "./pages/AddStudentPage";
import MultiChoiceQuestions from "./pages/WriteMultichoiceQuestions";
import AddMultichoiceQuestions from "./pages/AddMultiplechoiceQuestions";
import UserSettingPage from "./pages/UserSetting";
import AddTeacher from "./pages/AddTeacherPage";
import WelcomePage from "./pages/WelcomePage";
import AddQuestionPage from "./pages/AddQuestionForm";
import AddQuestionForm from "./pages/AddMCQCodingQuestion";
import WriteExam from "./pages/WriteExam";
import WriteMcqCoding from "./pages/WriteMCQCodingExam";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import Result from "./pages/Result";
import AssignMarksPage from "./pages/AssignMarksPage";
import SubjectDetailedResult from "./pages/SubjectResult";
import StudentList from "./pages/StudentList";
import ExamResult from "./pages/CodeResult";
import TeacherList from "./pages/TeacherList";
import Leaderboard from "./pages/Leaderboard";
import { useAuthStore } from "./store/authStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user.isVerified) return <Navigate to="/verify-email" replace />;
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) return <Navigate to="/admin" replace />;
  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div
			className='min-h-screen bg-gradient-to-b from-[#0F1C2E] to-[#1E2A44] flex items-center justify-center relative overflow-hidden'
		>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/adminDashboard" element={<ProtectedRoute><Adminpage /></ProtectedRoute>} />

        {/* Authentication Routes */}
        <Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>} />
        <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgotPasswordPage /></RedirectAuthenticatedUser>} />
        <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="/student-login" element={<StudentLoginPage />} />
        <Route path="/student/:studentId" element={<StudentPage />} />
        <Route path="/student/:studentId/multi-choice" element={<MultiChoiceQuestions />} />
        <Route path="/student/:studentId/write-exam" element={<WriteExam />} />
        <Route path="/student/:studentId/result" element={<Result />} />
        <Route path="/test-result/:studentId/:subjectName" element={<SubjectDetailedResult />} />
        <Route path="/exam-result/:studentId" element={<ExamResult />} />
        <Route path="/student/:studentId/write-mcq-coding" element={<WriteMcqCoding />} />

        {/* Teacher Routes */}
        <Route path="/teacher-login" element={<TeacherLoginPage />} />
        <Route path="/teacher/:teacherId" element={<TeacherPage />} />
        <Route path="/assign-marks" element={<AssignMarksPage />} />
        <Route path="/teacher/:teacherId/add-multi-choice" element={<AddMultichoiceQuestions />} />

        {/* Admin Utility Routes (Assuming these are admin-only, add protection if needed) */}
        <Route path="/add-student" element={<ProtectedRoute><AddStudentPage /></ProtectedRoute>} />
        <Route path="/add-teacher" element={<ProtectedRoute><AddTeacher /></ProtectedRoute>} />
        <Route path="/Add-Questions" element={<AddQuestionPage />} />
        <Route path="/teachers-list" element={<ProtectedRoute><TeacherList /></ProtectedRoute>} />
        <Route path="/students-list" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />

        {/* Settings Route */}
        <Route path="/:userType/:userId/settings" element={<UserSettingPage />} />

        {/* LeaderBoard */}
        <Route path="/leaderboard" element={<Leaderboard/>} />
        {/* General Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/:teacherId/add-mcq-coding-question" element={<AddQuestionForm />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
