import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import InteractiveDemo from "./InteractiveDemo";

const Hero = () => {
  return (
    <section className="relative">
      <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-10 sm:px-6 sm:pt-14 lg:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-[#6D28FF]">
            <Sparkles className="h-3.5 w-3.5" />
            Write Once. Reuse Forever.
          </span>
          <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Stop Editing The Same Information{" "}
            <span className="bg-gradient-to-r from-[#6D28FF] to-[#3B82F6] bg-clip-text text-transparent">
              Again And Again
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
            Create reusable notes with smart variables. Update names, companies,
            emails, projects, and more in every note by changing a value only
            once.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#6D28FF] px-7 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-[#5b1fe0] active:scale-[0.98] sm:w-auto"
            >
              Start Free <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#demo"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-7 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98] sm:w-auto"
            >
              Try Live Demo
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            No credit card. No setup. Start instantly.
          </p>
        </div>

        {/* Interactive demo */}
        <div id="demo" className="mx-auto mt-12 max-w-4xl scroll-mt-20 sm:mt-16">
          <InteractiveDemo />
          <p className="mt-3 text-center text-sm text-slate-500">
            Edit a value on the left — the preview updates instantly.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
