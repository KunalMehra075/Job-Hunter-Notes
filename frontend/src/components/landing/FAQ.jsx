import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "What are reusable notes?",
    a: "Reusable notes are templates containing variables like {{name}} and {{company}} that can be updated instantly.",
  },
  {
    q: "How do variables work?",
    a: "Variables act as placeholders that automatically update across all connected notes.",
  },
  {
    q: "Can I use ReuseNotes for AI prompts?",
    a: "Yes. ReuseNotes is perfect for reusable ChatGPT, Claude, Gemini, and AI workflow templates.",
  },
  {
    q: "Can I use unlimited variables?",
    a: "Yes. Create as many variables as needed.",
  },
  {
    q: "Can I use it for contracts, emails, and documents?",
    a: "Absolutely. Any text-based template can be reused.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. Get started instantly.",
  },
  {
    q: "Is my data private?",
    a: "Your notes remain private and secure.",
  },
  {
    q: "Why not use Notion or Google Docs?",
    a: "ReuseNotes is purpose-built for dynamic templates and instant variable replacement, making repetitive work significantly faster.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal as="h2" className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Frequently Asked Questions
        </Reveal>

        <div className="mt-10 space-y-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 open:bg-white open:shadow-sm transition"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-slate-900">
                {item.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
