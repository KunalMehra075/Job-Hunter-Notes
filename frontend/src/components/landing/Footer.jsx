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

        <nav className="flex items-center gap-6 text-sm text-slate-600">
          <a href="#features" className="transition hover:text-slate-900">Features</a>
          <a href="#faq" className="transition hover:text-slate-900">FAQ</a>
          <a href="#" className="transition hover:text-slate-900">Privacy</a>
        </nav>

        <p className="text-sm text-slate-400">© ReuseNotes.com</p>
      </div>
    </footer>
  );
};

export default Footer;
