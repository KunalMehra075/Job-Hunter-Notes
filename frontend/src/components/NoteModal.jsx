import { useState, useEffect } from "react";
import axios from "axios";
import { BaseURL } from "../utils/BaseURL";
import { Plus, Edit } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import VariableHighlightEditor from "./VariableHighlightEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
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
        await axios.post(`${BaseURL}/notes`, {
          title,
          paragraph,
        });
        toast.success("Note created successfully");
        if (onNoteAdded) {
          onNoteAdded();
        }
      } else if (mode === "edit" && noteData) {
        await axios.put(`${BaseURL}/notes/${noteData.id}`, {
          title,
          paragraph,
        });
        toast.success("Note updated successfully");
        if (onNoteUpdated) {
          onNoteUpdated();
        }
      }

      // Reset form and close modal
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
      <DialogContent className="modal-no-focus sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "add" ? (
              <>
                <Plus className="w-5 h-5" />
                Add New Note
              </>
            ) : (
              <>
                <Edit className="w-5 h-5" />
                Edit Note
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 space-y-4 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="modal-title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                type="text"
                id="modal-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                required
                className="w-full outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-border"
                style={{ outline: "none", boxShadow: "none" }}
              />
            </div>

            <div className="space-y-2 flex-1 flex flex-col min-h-0">
              <Label htmlFor="modal-paragraph" className="text-sm font-medium">
                Content
              </Label>
              <VariableHighlightEditor
                id="modal-paragraph"
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                placeholder="Enter note content... Click variables above to insert them or type them manually like {{variableName}}"
                required
                className="flex-1"
                style={{ outline: "none", boxShadow: "none" }}
              />
            </div>
          </div>

          <DialogFooter className="mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {isLoading
                ? mode === "add"
                  ? "Creating..."
                  : "Updating..."
                : mode === "add"
                ? "Create Note"
                : "Update Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoteModal;
