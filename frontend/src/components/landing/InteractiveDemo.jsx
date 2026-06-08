import { useState } from "react";
import highlightText from "../../utils/textHighlighter";

// Real-world scenarios: each has 2 editable variables that drive several notes,
// so visitors immediately see "change a value once → every note updates."
const SCENARIOS = [
  {
    id: "job",
    label: "Job outreach",
    blurb: "Edit the company & recruiter once — every message updates.",
    fields: [
      { key: "company", label: "Company", value: "Stripe", color: "#EF4444" },
      { key: "hrName", label: "Recruiter", value: "Priya", color: "#3B82F6" },
    ],
    notes: [
      {
        title: "Reach-out",
        body: `Hi {{hrName}}, I came across the Frontend Engineer role at {{company}} and would love to connect. Could we set up a quick chat this week?`,
      },
      {
        title: "Cover letter",
        body: `Dear {{hrName}},\n\nI'm excited to apply to {{company}} — your work on developer tooling is exactly where I want to make an impact.`,
      },
      {
        title: "Follow-up",
        body: `Hi {{hrName}}, just following up on my application to {{company}}. I'm still very interested and happy to share more.`,
      },
    ],
  },
  {
    id: "prompts",
    label: "AI prompts",
    blurb: "Reuse your favorite prompts with a new topic & audience.",
    fields: [
      { key: "topic", label: "Topic", value: "remote work", color: "#10B981" },
      { key: "audience", label: "Audience", value: "startup founders", color: "#F59E0B" },
    ],
    notes: [
      {
        title: "Blog outline",
        body: `Write a detailed blog outline about {{topic}} for {{audience}}. Include 5 H2 sections and a short intro hook.`,
      },
      {
        title: "Tweet thread",
        body: `Create a 6-tweet thread on {{topic}} aimed at {{audience}}. Punchy, no hashtags, strong first line.`,
      },
      {
        title: "Cold email",
        body: `Draft a cold email about {{topic}} targeting {{audience}}. Under 90 words, one clear CTA.`,
      },
    ],
  },
  {
    id: "api",
    label: "API / cURL",
    blurb: "Same token & user ID across every request — change once, reuse everywhere.",
    mono: true,
    fields: [
      { key: "userId", label: "User ID", value: "usr_8f2a", color: "#EC4899" },
      { key: "token", label: "Access token", value: "sk_live_J4k9", color: "#6D28FF" },
    ],
    notes: [
      {
        title: "Fetch profile",
        body: `curl https://api.acme.dev/v1/users/{{userId}} \\\n  -H "Authorization: Bearer {{token}}"`,
      },
      {
        title: "List products",
        body: `curl https://api.acme.dev/v1/products \\\n  -H "Authorization: Bearer {{token}}" \\\n  -H "X-User-Id: {{userId}}" \\\n  -H "Content-Type: application/json"`,
      },
    ],
  },
];

const Scenario = ({ scenario }) => {
  const { fields, notes, label, blurb, mono } = scenario;
  const [values, setValues] = useState(() =>
    fields.reduce((acc, f) => ({ ...acc, [f.key]: f.value }), {})
  );

  const variables = fields.map((f) => ({
    key: f.key,
    value: values[f.key],
    color: f.color,
  }));

  const noteCols = notes.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-lg shadow-violet-500/5 backdrop-blur">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-[#6D28FF]">
          {label}
        </span>
        <span className="text-sm text-slate-500">{blurb}</span>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Variables — left */}
        <div className="space-y-3 lg:w-52 lg:shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Variables
          </p>
          {fields.map((f) => (
            <div key={f.key}>
              <label
                className="mb-1 block text-xs font-semibold"
                style={{ color: f.color }}
              >
                {`{{${f.key}}}`}
              </label>
              <input
                type="text"
                value={values[f.key]}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.key]: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#6D28FF] focus:ring-2 focus:ring-[#6D28FF]/20"
                aria-label={f.label}
              />
            </div>
          ))}
        </div>

        {/* Notes that use those variables — right */}
        <div className={`grid flex-1 gap-3 ${noteCols}`}>
          {notes.map((n) => (
            <div
              key={n.title}
              className="rounded-xl border border-slate-200 bg-white p-3"
            >
              <div className="mb-1.5 text-xs font-semibold text-slate-400">
                {n.title}
              </div>
              <p
                className={
                  mono
                    ? "whitespace-pre-wrap break-words font-mono text-[12px] leading-relaxed text-slate-700"
                    : "whitespace-pre-wrap text-[13px] leading-relaxed text-slate-700"
                }
                dangerouslySetInnerHTML={{
                  __html: highlightText(n.body, variables),
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InteractiveDemo = () => (
  <div className="space-y-4">
    {SCENARIOS.map((s) => (
      <Scenario key={s.id} scenario={s} />
    ))}
  </div>
);

export default InteractiveDemo;
