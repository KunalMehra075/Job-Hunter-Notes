import { useState } from "react";
import highlightText from "../../utils/textHighlighter";

const FIELDS = [
  { key: "name", label: "Name", value: "Kael Mercer", color: "#6D28FF" },
  { key: "company", label: "Company", value: "Nimbus Forge", color: "#3B82F6" },
  { key: "email", label: "Email", value: "kael@nimbusforge.io", color: "#EC4899" },
  { key: "project", label: "Project", value: "Project Aurora", color: "#F59E0B" },
];

const TEMPLATE = `Hello {{name}}

Welcome to {{company}}.

Project: {{project}}

Contact: {{email}}`;

const InteractiveDemo = () => {
  const [values, setValues] = useState(
    FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: f.value }), {})
  );

  const variables = FIELDS.map((f) => ({
    key: f.key,
    value: values[f.key],
    color: f.color,
  }));

  const previewHtml = highlightText(TEMPLATE, variables);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Variables */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-5 shadow-lg shadow-violet-500/5">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#6D28FF]" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Variables
          </h3>
        </div>
        <div className="space-y-3">
          {FIELDS.map((f) => (
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
      </div>

      {/* Live preview */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-5 shadow-lg shadow-violet-500/5">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Live Preview
          </h3>
        </div>
        <p
          className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    </div>
  );
};

export default InteractiveDemo;
