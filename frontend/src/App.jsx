import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import LandingPage from "./components/landing/LandingPage";
import { ToastContainer } from "react-toastify";
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";
import axios from "axios";
import { BaseURL } from "./utils/BaseURL";
import { ThemeProvider } from "./components/theme-provider";

// White toasts with brand-appropriate colored icons per type.
const toastIcon = ({ type }) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "error":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5 text-[#6D28FF]" />;
  }
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await axios.get(`${BaseURL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Root: logged-in users go to the app, everyone else sees the landing page.
const RootRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};

// Login: hide it from already-logged-in users.
const LoginRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : <Login />;
};

const App = () => {
  useEffect(() => {
    // Set up axios defaults
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="reuse-notes-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<RootRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          newestOnTop={false}
          draggable
          pauseOnHover
          theme="light"
          icon={toastIcon}
        />
      </Router>
    </ThemeProvider>
  );
};

export default App;
