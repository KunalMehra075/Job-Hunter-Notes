import { forwardRef, useImperativeHandle, useRef } from "react";
import { cn } from "../lib/utils";

// Borderless, Keep-style note textarea. Exposes insertVariable() to the parent
// so the variable chips can live in the modal's bottom toolbar.
const VariableHighlightEditor = forwardRef(
  ({ value, onChange, placeholder, className, style, ...props }, ref) => {
    const textareaRef = useRef(null);

    const insertVariable = (variableName) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const variableText = `{{${variableName}}}`;
      const newValue =
        value.substring(0, start) + variableText + value.substring(end);

      onChange({ target: { value: newValue } });

      setTimeout(() => {
        const pos = start + variableText.length;
        textarea.setSelectionRange(pos, pos);
        textarea.focus();
      }, 0);
    };

    useImperativeHandle(ref, () => ({ insertVariable }));

    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full resize-none bg-transparent text-foreground",
          "text-sm placeholder:text-muted-foreground",
          "border-0 outline-none focus:outline-none focus:ring-0",
          className
        )}
        style={{ minHeight: "220px", ...style }}
        {...props}
      />
    );
  }
);

VariableHighlightEditor.displayName = "VariableHighlightEditor";

export default VariableHighlightEditor;
