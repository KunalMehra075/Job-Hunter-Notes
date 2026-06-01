import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BaseURL } from "../utils/BaseURL";
import { toast } from "react-toastify";
import { CheckSquare, Paintbrush, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import VariableHighlightEditor from "./VariableHighlightEditor";

const NoteComposer = ({ onNoteAdded }) => {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const variables = useSelector((state) => state.variables.variables);

  const reset = () => {
    setTitle("");
    setParagraph("");
    setExpanded(false);
  };

  const save = async () => {
    if (!title.trim() && !paragraph.trim()) {
      reset();
      return;
    }
    setIsSaving(true);
    try {
      await axios.post(`${BaseURL}/notes`, {
        title: title.trim() || "Untitled",
        paragraph: paragraph.trim() || " ",
      });
      toast.success("Note created");
      onNoteAdded?.();
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create note");
    } finally {
      setIsSaving(false);
    }
  };

  // Collapse (and save) when clicking outside the expanded composer
  useEffect(() => {
    if (!expanded) return;
    const onMouseDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        save();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, title, paragraph]);

  const expand = () => setExpanded(true);

  return (
    <div ref={containerRef} className="w-full max-w-2xl">
      {!expanded ? (
        <div
          onClick={expand}
          className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 shadow-sm cursor-text hover:shadow-md transition-shadow"
        >
          <span className="text-muted-foreground font-medium">Take a note...</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={expand} aria-label="New note">
              <CheckSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={expand} aria-label="New note">
              <Paintbrush className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={expand} aria-label="New note">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card shadow-lg">
          <div className="px-4 pt-4 pb-2 space-y-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent text-base font-semibold text-foreground placeholder:text-muted-foreground border-0 outline-none focus:outline-none focus:ring-0"
            />
            <VariableHighlightEditor
              ref={editorRef}
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              placeholder="Take a note..."
              autoFocus
              style={{ minHeight: "120px" }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 px-4 py-2 border-t">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground mr-1">Insert:</span>
              {variables.map((variable) => (
                <button
                  key={variable._id || variable.key}
                  type="button"
                  onClick={() => editorRef.current?.insertVariable(variable.key)}
                  className="px-2 py-1 text-xs rounded-md border transition-colors cursor-pointer"
                  style={{
                    backgroundColor: `${variable.color}1a`,
                    color: variable.color,
                    borderColor: `${variable.color}33`,
                  }}
                >
                  {variable.key}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={reset} disabled={isSaving}>
                Close
              </Button>
              <Button size="sm" onClick={save} disabled={isSaving} className="min-w-[80px]">
                {isSaving ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteComposer;
