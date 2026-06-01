import { useState, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "../store/store";
import VariablesSidebar from "./VariablesSidebar";
import NotesContainer from "./NotesContainer";
import NoteComposer from "./NoteComposer";
import Navbar from "./Navbar";
import NoteModal from "./NoteModal";
import ConfirmDialog from "./ConfirmDialog";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import { resetLayouts } from "../store/layoutSlice";
import { toast } from "react-toastify";

const DashboardContent = () => {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNoteData, setEditNoteData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  useEffect(() => {
    document.title = "Dashboard · ReuseNotes";
  }, []);

  const handleNoteAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleNoteUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
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
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error resetting layouts:", error);
      toast.error("Error resetting layouts");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <VariablesSidebar />
      <div className="ml-64">
        <main className="px-6 py-6">
          {/* Composer (centered) + Reset Layout on the same level */}
          <div className="mb-8 flex items-start gap-3">
            <div className="flex flex-1 justify-center">
              <NoteComposer onNoteAdded={handleNoteAdded} />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetLayouts}
              className="flex shrink-0 items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Layout
            </Button>
          </div>

          <NotesContainer
            refreshTrigger={refreshTrigger}
            resetSignal={resetSignal}
            onEditNote={handleEditNote}
          />

          {/* Edit Note Modal */}
        <NoteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onNoteUpdated={handleNoteUpdated}
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
