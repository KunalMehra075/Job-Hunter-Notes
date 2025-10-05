import { useState } from "react";
import axios from "axios";
import { BaseURL } from "../utils/BaseURL";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const AddNote = ({ onNoteAdded }) => {
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${BaseURL}/notes`, {
        title,
        paragraph,
      });

      setTitle("");
      setParagraph("");
      setIsOpen(false);
      toast.success("Note created successfully");

      if (onNoteAdded) {
        onNoteAdded();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create note");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2"
          >
            Add New Note <Plus className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Add New Note</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paragraph">Paragraph</Label>
                <Textarea
                  id="paragraph"
                  value={paragraph}
                  onChange={(e) => setParagraph(e.target.value)}
                  placeholder="Enter note content..."
                  className="min-h-[120px]"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button disabled={isLoading} type="submit">
                  {isLoading ? "Saving..." : "Save Note"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddNote;
