import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import Premium from './pages/Premium';
import Profile from './pages/Profile';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading, profile } = useAuth();

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-black text-primary"><Loader2 className="animate-spin h-10 w-10" /></div>;

  if (!session) return <Navigate to="/login" replace />;
  if (!profile) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
}

import AuthCallback from './pages/auth/callback';

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
