import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BaseURL } from "../utils/BaseURL";
import NotificationDialog from "./NotificationDialog";
import LoginArt from "./LoginArt";
import logo from "../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    description: "",
    variant: "info",
    autoClose: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Sign in · ReuseNotes";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BaseURL}/auth/login`, { email });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      navigate("/dashboard");
    } catch (error) {
      setNotification({
        isOpen: true,
        title: "Error",
        description: error.response?.data?.message || "Failed to continue",
        variant: "error",
        autoClose: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Left: form */}
      <div className="relative flex flex-col px-6 py-8 sm:px-10">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="ReuseNotes logo" className="h-8 w-8" />
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-slate-900">Reuse</span>
            <span className="text-[#6D28FF]">Notes</span>
          </span>
        </Link>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Sign in to your account
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                We just need your email.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#6D28FF] focus:ring-2 focus:ring-[#6D28FF]/20"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-[#6D28FF] text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b1fe0] active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? "Please wait..." : "Continue"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              No password needed. We'll create your space if it's your first
              time.
            </p>
          </div>
        </div>
      </div>

      {/* Right: illustration (hidden on mobile) */}
      <div className="relative hidden overflow-hidden lg:block">
        <LoginArt className="absolute inset-0 h-full w-full" />
      </div>

      {/* Notification Dialog */}
      <NotificationDialog
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        description={notification.description}
        variant={notification.variant}
        autoClose={notification.autoClose}
      />
    </div>
  );
};

export default Login;
