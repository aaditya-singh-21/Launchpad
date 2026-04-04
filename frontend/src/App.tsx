import { Button } from "@/components/ui/button"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SigninPage from './pages/SignInPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoutes from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-foreground">
      <div className="mb-8 p-6 border rounded-xl shadow-lg bg-card max-w-md w-full text-center">
        <h1 className="text-3xl font-extrabold mb-4 tracking-tight">Tailwind + shadcn/ui</h1>
        <p className="text-muted-foreground mb-6">Setup successful! You can now use shadcn components.</p>
        <Button size="lg" onClick={() => console.log("clicked")}>
          Get Started
        </Button>
      </div>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path='/signin' element={<SigninPage />}></Route>
            <Route path='/signup' element={<SignupPage />}></Route>
            <Route path='/profile' element={
              <ProtectedRoutes>
                <ProfilePage />
              </ProtectedRoutes>
            } />
            <Route path="*" element={
              <div style={{ padding: '100px', textAlign: 'center' }}>
                <h2>Page Not Found</h2>
              </div>
            } />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
