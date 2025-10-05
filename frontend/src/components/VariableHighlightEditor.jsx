import { useRef } from "react";
import { cn } from "../lib/utils";

const VariableHighlightEditor = ({
  value,
  onChange,
  placeholder,
  className,
  style,
  ...props
}) => {
  const textareaRef = useRef(null);

  // Available variables with their colors
  const availableVariables = [
    {
      name: "companyName",
      label: "Company Name",
      color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
    },
    {
      name: "jobTitle",
      label: "Job Title",
      color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
    },
    {
      name: "jobLink",
      label: "Job Link",
      color: "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20",
    },
    {
      name: "personName",
      label: "Person Name",
      color: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20",
    },
  ];

  // Handle textarea changes
  const handleChange = (e) => {
    onChange(e);
  };

  // Insert variable at cursor position
  const insertVariable = (variableName) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const variableText = `{{${variableName}}}`;

    // Insert the variable at cursor position
    const newValue =
      value.substring(0, start) + variableText + value.substring(end);

    // Create synthetic event for onChange
    const syntheticEvent = {
      target: {
        value: newValue,
      },
    };

    onChange(syntheticEvent);

    // Set cursor position after the inserted variable
    setTimeout(() => {
      const newCursorPosition = start + variableText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  };

  return (
    <div className="space-y-3">
      {/* Variable buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground self-center">
          Available variables:
        </span>
        {availableVariables.map((variable) => (
          <button
            key={variable.name}
            type="button"
            onClick={() => insertVariable(variable.name)}
            className={cn(
              "px-2 py-1 text-xs rounded-md border transition-colors cursor-pointer",
              variable.color
            )}
          >
            {variable.label}
          </button>
        ))}
      </div>

      {/* Simple textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "w-full resize-none",
          "border border-input rounded-md px-3 py-2",
          "text-sm placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "bg-background text-foreground",
          className
        )}
        style={{
          minHeight: "200px",
          ...style,
        }}
        {...props}
      />
    </div>
  );
};

export default VariableHighlightEditor;
