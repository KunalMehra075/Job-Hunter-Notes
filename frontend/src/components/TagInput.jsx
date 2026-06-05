import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

// Simple tag editor: type a tag + Enter/comma to add; click × to remove.
const TagInput = ({
  tags = [],
  onChange,
  placeholder = "Add tag...",
  borderless = false,
}) => {
  const [value, setValue] = useState("");

  const addTag = (raw) => {
    const tag = raw.trim().replace(/\s+/g, "-");
    if (!tag) return;
    if (!tags.includes(tag)) onChange([...tags, tag]);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(value);
    } else if (e.key === "Backspace" && !value && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5",
        borderless
          ? "px-0 py-0"
          : "rounded-lg border border-slate-200 bg-white px-2 py-1.5 dark:border-slate-700 dark:bg-transparent"
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-[#6D28FF]"
        >
          #{tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="rounded-full hover:bg-violet-200"
            aria-label={`Remove ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(value)}
        placeholder={tags.length ? "" : placeholder}
        className="min-w-[100px] flex-1 bg-transparent px-1 py-0.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
      />
    </div>
  );
};

export default TagInput;
