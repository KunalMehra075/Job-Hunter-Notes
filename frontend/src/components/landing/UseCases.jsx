import { Bot, Send, Briefcase, Users } from "lucide-react";
import Reveal from "./Reveal";

const CASES = [
  {
    icon: Bot,
    title: "AI Prompt Templates",
    desc: "Create reusable ChatGPT and Claude prompts.",
  },
  {
    icon: Send,
    title: "Sales Outreach",
    desc: "Personalize emails instantly.",
  },
  {
    icon: Briefcase,
    title: "Freelancers & Agencies",
    desc: "Reuse proposals, contracts, and project templates.",
  },
  {
    icon: Users,
    title: "Teams & Documentation",
    desc: "Standardize recurring content.",
  },
];

const UseCases = () => {
  return (
    <section id="use-cases" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal as="h2" className="mx-auto max-w-2xl text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Built For Repetitive Work
      </Reveal>
      <Reveal as="p" className="mx-auto mt-3 max-w-xl text-center text-slate-600">
        Anyone who types the same thing twice gets hours back.
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CASES.map((c, i) => (
          <Reveal
            key={c.title}
            style={{ animationDelay: `${i * 80}ms` }}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/10"
          >
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#6D28FF] to-[#3B82F6] text-white">
              <c.icon className="h-5 w-5" />
            </span>
            <h3 className="text-base font-semibold text-slate-900">{c.title}</h3>
            <p className="mt-1.5 text-sm text-slate-600">{c.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default UseCases;
