import { Link } from "react-router-dom";

const MobileStickyCTA = () => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/90 p-3 backdrop-blur sm:hidden">
      <Link
        to="/dashboard"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[#6D28FF] text-base font-semibold text-white shadow-lg shadow-violet-500/25 active:scale-[0.99]"
      >
        Start Free
      </Link>
    </div>
  );
};

export default MobileStickyCTA;
