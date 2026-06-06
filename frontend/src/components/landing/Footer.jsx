import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-[#F8FAFC]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <img src={logo} alt="ReuseNotes logo" className="h-7 w-7" />
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-slate-900">Reuse</span>
            <span className="text-[#6D28FF]">Notes</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
          <a href="#features" className="transition hover:text-slate-900">Features</a>
          <a href="#faq" className="transition hover:text-slate-900">FAQ</a>
          <a href="/about" className="transition hover:text-slate-900">About</a>
          <a href="/contact" className="transition hover:text-slate-900">Contact</a>
          <a href="/privacy" className="transition hover:text-slate-900">Privacy</a>
          <a href="/terms" className="transition hover:text-slate-900">Terms</a>
        </nav>

        <p className="text-sm text-slate-400">© ReuseNotes.com</p>
      </div>
    </footer>
  );
};

export default Footer;
