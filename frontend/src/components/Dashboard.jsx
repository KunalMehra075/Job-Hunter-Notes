import { useState, useEffect, useCallback } from "react";
import { Provider, useDispatch } from "react-redux";
import axios from "axios";
import { store } from "../store/store";
import { BaseURL } from "../utils/BaseURL";
import VariablesSidebar from "./VariablesSidebar";
import NotesContainer from "./NotesContainer";
import NoteComposer from "./NoteComposer";
import Navbar from "./Navbar";
import NoteModal from "./NoteModal";
import ConfirmDialog from "./ConfirmDialog";
import TagFilter from "./TagFilter";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import { resetLayouts } from "../store/layoutSlice";
import { toast } from "react-toastify";

const DashboardContent = () => {
  const dispatch = useDispatch();
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNoteData, setEditNoteData] = useState(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = "Dashboard · ReuseNotes";
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get(`${BaseURL}/notes`);
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setNotesLoading(false);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const res = await axios.get(`${BaseURL}/tags`);
      setAllTags(res.data.map((t) => t.name));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
    fetchTags();
  }, [fetchNotes, fetchTags]);

  // Optimistic, note-wise updates (no full container reload)
  const handleNoteCreated = (note) => {
    setNotes((prev) => [note, ...prev]);
    fetchTags();
  };
  const handleNoteUpdated = (note) => {
    setNotes((prev) => prev.map((n) => (n._id === note._id ? note : n)));
    fetchTags();
  };
  const handleNoteDeleted = (id) =>
    setNotes((prev) => prev.filter((n) => n._id !== id));

  const toggleTag = (tag) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const handleTogglePin = async (note) => {
    try {
      const res = await axios.put(`${BaseURL}/notes/${note._id}`, {
        pinned: !note.pinned,
      });
      handleNoteUpdated(res.data);
    } catch (error) {
      console.error("Error pinning note:", error);
      toast.error("Failed to update pin");
    }
  };

  const handleEditNote = (noteData) => {
    setEditNoteData(noteData);
    setIsEditModalOpen(true);
  };

  const handleResetLayouts = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = async () => {
    try {
      await dispatch(resetLayouts()).unwrap();
      toast.success("Layout reset successfully");
      setResetSignal((prev) => prev + 1);
    } catch (error) {
      console.error("Error resetting layouts:", error);
      toast.error("Error resetting layouts");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onOpenVariables={() => setSidebarOpen(true)} />
      <VariablesSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:ml-64">
        <main className="min-h-[calc(100vh-4rem)] bg-slate-100 px-4 py-6 sm:px-6 dark:bg-slate-900">
          {/* Composer (centered) + Reset Layout on the same level */}
          <div className="mb-8 flex items-start gap-3">
            <div className="flex flex-1 justify-center">
              <NoteComposer onCreated={handleNoteCreated} />
            </div>
            <TagFilter
              tags={allTags}
              selected={selectedTags}
              onToggle={toggleTag}
              onClear={() => setSelectedTags([])}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetLayouts}
              className="hidden shrink-0 items-center gap-2 lg:flex"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Layout
            </Button>
          </div>

          <NotesContainer
            notes={notes}
            loading={notesLoading}
            resetSignal={resetSignal}
            filterTags={selectedTags}
            onEditNote={handleEditNote}
            onDeleted={handleNoteDeleted}
            onTogglePin={handleTogglePin}
          />

          {/* Edit Note Modal */}
          <NoteModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onUpdated={handleNoteUpdated}
            mode="edit"
            noteData={editNoteData}
          />

          {/* Reset Layout Confirmation Dialog */}
          <ConfirmDialog
            isOpen={isResetConfirmOpen}
            onClose={() => setIsResetConfirmOpen(false)}
            onConfirm={handleConfirmReset}
            title="Reset Layout?"
            description="This will reset all notes to their default positions. This action cannot be undone."
            confirmText="Yes, Reset"
            cancelText="Cancel"
            variant="warning"
            confirmVariant="destructive"
          />
        </main>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Provider store={store}>
      <DashboardContent />
    </Provider>
  );
};

export default Dashboard;
