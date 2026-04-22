import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SigninPage from './pages/SignInPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoutes from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import AuthCallback from "./pages/AuthCallback";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen w-full flex flex-col bg-white">
          <Navbar />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path='/signin' element={<SigninPage />} />
              <Route path='/signup' element={<SignupPage />} />
              <Route path='/auth/callback' element={<AuthCallback />} />
              <Route path='/explore' element={<ExplorePage />} />
              <Route path='/profile' element={
                <ProtectedRoutes>
                  <ProfilePage />
                </ProtectedRoutes>
              } />
              <Route path="*" element={
                <div className="flex items-center justify-center min-h-[70vh]">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">Page Not Found</h2>
                    <p className="text-zinc-500">The page you're looking for doesn't exist.</p>
                  </div>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
