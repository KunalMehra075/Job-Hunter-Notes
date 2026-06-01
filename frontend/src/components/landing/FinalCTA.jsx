import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

const FinalCTA = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6D28FF] to-[#3B82F6] px-6 py-14 text-center shadow-xl shadow-violet-500/25 sm:px-12">
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <h2 className="relative text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
          Write It Once. Never Rewrite It Again.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-violet-100">
          Save hours every week by turning repetitive content into reusable
          templates.
        </p>
        <Link
          to="/dashboard"
          className="relative mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-semibold text-[#6D28FF] shadow-lg transition hover:bg-slate-50 active:scale-[0.98]"
        >
          Start Using ReuseNotes <ArrowRight className="h-5 w-5" />
        </Link>
      </Reveal>
    </section>
  );
};

export default FinalCTA;
