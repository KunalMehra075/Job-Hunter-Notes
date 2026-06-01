import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const LandingNav = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-[#F8FAFC]/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="ReuseNotes logo" className="h-8 w-8" />
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-slate-900">Reuse</span>
            <span className="text-[#6D28FF]">Notes</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          <a href="#features" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Features
          </a>
          <a href="#use-cases" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Use Cases
          </a>
          <a href="#faq" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            FAQ
          </a>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#6D28FF] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b1fe0] active:scale-[0.98]"
        >
          Start Free
        </Link>
      </nav>
    </header>
  );
};

export default LandingNav;
