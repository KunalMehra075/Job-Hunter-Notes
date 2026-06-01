import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BaseURL } from "../utils/BaseURL";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import VariableHighlightEditor from "./VariableHighlightEditor";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import "./NoteModal.css";

const NoteModal = ({
  isOpen,
  onClose,
  onNoteAdded,
  onNoteUpdated,
  mode = "add", // "add" or "edit"
  noteData = null, // For edit mode
}) => {
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef(null);
  const variables = useSelector((state) => state.variables.variables);

  // Initialize form data when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && noteData) {
        setTitle(noteData.title || "");
        setParagraph(noteData.paragraph || "");
      } else {
        setTitle("");
        setParagraph("");
      }
    }
  }, [isOpen, mode, noteData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "add") {
        await axios.post(`${BaseURL}/notes`, { title, paragraph });
        toast.success("Note created successfully");
        if (onNoteAdded) onNoteAdded();
      } else if (mode === "edit" && noteData) {
        await axios.put(`${BaseURL}/notes/${noteData.id}`, { title, paragraph });
        toast.success("Note updated successfully");
        if (onNoteUpdated) onNoteUpdated();
      }

      setTitle("");
      setParagraph("");
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (mode === "add" ? "Failed to create note" : "Failed to update note");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setParagraph("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="modal-no-focus sm:max-w-[640px] max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0 rounded-2xl shadow-xl [&>button]:hidden">
        <DialogTitle className="sr-only">
          {mode === "add" ? "Add note" : "Edit note"}
        </DialogTitle>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 space-y-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent text-lg font-semibold text-foreground placeholder:text-muted-foreground border-0 outline-none focus:outline-none focus:ring-0"
            />
            <VariableHighlightEditor
              ref={editorRef}
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              placeholder="Take a note..."
              required
            />
          </div>

          {/* Bottom toolbar */}
          <div className="border-t px-4 py-3 space-y-3">
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

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-[110px]">
                {isLoading
                  ? mode === "add"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "add"
                  ? "Create Note"
                  : "Update Note"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoteModal;
