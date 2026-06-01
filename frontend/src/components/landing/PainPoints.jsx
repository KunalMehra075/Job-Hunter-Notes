import { XCircle, Check } from "lucide-react";
import Reveal from "./Reveal";

const PAINS = [
  "Updating client names across multiple templates",
  "Rewriting AI prompts repeatedly",
  "Editing the same email over and over",
  "Maintaining multiple versions of documents",
];

const PainPoints = () => {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal as="h2" className="mx-auto max-w-2xl text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Still Copying And Pasting The Same Information?
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {PAINS.map((p, i) => (
          <Reveal
            key={p}
            style={{ animationDelay: `${i * 80}ms` }}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <span className="text-[15px] text-slate-700">{p}</span>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 flex items-start gap-3 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-blue-50 p-6">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6D28FF]">
          <Check className="h-4 w-4 text-white" />
        </span>
        <p className="text-[15px] font-medium text-slate-800 sm:text-base">
          ReuseNotes fixes this by letting you define variables once and reuse
          them everywhere.
        </p>
      </Reveal>
    </section>
  );
};

export default PainPoints;
