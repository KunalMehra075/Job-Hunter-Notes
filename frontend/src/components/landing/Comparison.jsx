import { useEffect, useState } from "react";
import { Clock, Zap } from "lucide-react";
import Reveal from "./Reveal";

const NAMES = ["Acme Inc", "Globex", "Initech", "Umbrella"];

const Comparison = () => {
  const [idx, setIdx] = useState(0);

  // Auto-cycle the variable to show the "with" side cascading instantly.
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % NAMES.length), 1800);
    return () => clearInterval(t);
  }, []);

  const company = NAMES[idx];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal as="h2" className="mx-auto max-w-2xl text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          One Change. Everything Updates.
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {/* Without */}
          <Reveal className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              <h3 className="font-semibold text-slate-700">Without ReuseNotes</h3>
            </div>
            <p className="mb-4 text-sm text-slate-500">
              Edit 15 templates manually, one by one.
            </p>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400"
                >
                  <span>Template {i + 1}</span>
                  <span className="text-xs text-red-400">needs editing…</span>
                </div>
              ))}
              <p className="pt-1 text-center text-xs text-slate-400">+ 11 more</p>
            </div>
          </Reveal>

          {/* With */}
          <Reveal className="relative overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#6D28FF]" />
              <h3 className="font-semibold text-slate-800">With ReuseNotes</h3>
            </div>
            <div className="mb-4 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm">
              <span className="text-xs font-semibold text-[#6D28FF]">{"{{company}}"}</span>
              <span className="ml-2 font-medium text-slate-800">{company}</span>
            </div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  <span>
                    Welcome to{" "}
                    <span
                      key={company}
                      className="rounded bg-violet-100 px-1 font-medium text-[#6D28FF] transition-all"
                    >
                      {company}
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-green-500">updated ✓</span>
                </div>
              ))}
              <p className="pt-1 text-center text-xs font-medium text-[#6D28FF]">
                Change once → all update instantly
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
