import Reveal from "./Reveal";

// Keyword-rich prose section for SEO depth. Reads naturally while reinforcing
// the terms people search for (reusable notes, smart variables, prompt
// templates, mail merge, dynamic text).
const SeoContent = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal as="h2" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Reusable notes built around smart variables
        </Reveal>

        <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
          <Reveal as="p">
            <strong className="text-slate-900">ReuseNotes</strong> is a reusable notes app — a way
            to build notes with variables and reuse them, turning the text you write over and over
            into dynamic templates you can alter in one place. Instead of copying an
            old note and hunting for every name, company, link, and date to replace, you write the
            note once using smart variables like{" "}
            <code className="rounded bg-violet-50 px-1.5 py-0.5 text-[#6D28FF]">{"{{companyName}}"}</code>{" "}
            or{" "}
            <code className="rounded bg-violet-50 px-1.5 py-0.5 text-[#6D28FF]">{"{{personName}}"}</code>.
            Set each value a single time and every note that uses it updates instantly — no manual
            find-and-replace, no missed details.
          </Reveal>

          <Reveal as="p">
            Think of it as a flexible placeholder replacer and lightweight mail-merge tool for
            everyday text. ReuseNotes is ideal for{" "}
            <strong className="text-slate-900">reusable AI prompt templates</strong> for ChatGPT,
            Claude, and Gemini, for sales and job outreach emails, for cover letters, proposals,
            and contracts, and for team documentation and support replies. Anywhere you reuse
            structured text, dynamic variables save you time and keep your wording consistent.
          </Reveal>

          <Reveal as="h3" className="pt-2 text-lg font-semibold text-slate-900">
            Why not just use Notion or Google Docs?
          </Reveal>
          <Reveal as="p">
            General-purpose documents are great for writing, but they have no concept of a single
            variable that updates everywhere at once. ReuseNotes is purpose-built for dynamic
            templates and instant variable replacement: organize notes with tags, pin the ones you
            use most, and copy a fully filled-in version with one click. It is free to start, uses
            passwordless email sign-in, and keeps your notes private to your account.
          </Reveal>

          <Reveal as="h3" className="pt-2 text-lg font-semibold text-slate-900">
            How ReuseNotes works
          </Reveal>
          <Reveal as="p">
            Create a note and drop in variables using the{" "}
            <code className="rounded bg-violet-50 px-1.5 py-0.5 text-[#6D28FF]">{"{{variable}}"}</code>{" "}
            syntax. Define each variable's value once in the sidebar. When you are ready to use a
            note, click copy — ReuseNotes fills in every variable and copies the final, ready-to-send
            text for you. Update a value later and every template that references it reflects the
            change immediately, so your reusable notes stay accurate without rewriting a thing.
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default SeoContent;
