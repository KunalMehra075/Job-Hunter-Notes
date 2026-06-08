import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const LandingNav = () => {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <nav className="mx-auto flex h-16 w-[92%] max-w-5xl items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-5 shadow-lg shadow-slate-900/5 backdrop-blur sm:px-6 lg:w-4/5">
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
          Create Note
        </Link>
      </nav>
    </header>
  );
};

export default LandingNav;
