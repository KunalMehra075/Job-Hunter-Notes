import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Responsive, WidthProvider } from "react-grid-layout";
import ParagraphCard from "./ParagraphCard";
import axios from "axios";
import { toast } from "react-toastify";
import { BaseURL } from "../utils/BaseURL";
import ConfirmDialog from "./ConfirmDialog";
import {
  fetchLayouts,
  batchUpdateLayouts,
  updateLocalLayouts,
  removeLocalLayout,
  fixLayoutConstraints,
} from "../store/layoutSlice";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./NotesContainer.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const NotesContainer = ({ refreshTrigger, onEditNote }) => {
  const dispatch = useDispatch();
  const { layouts, loading: layoutLoading } = useSelector(
    (state) => state.layout
  );
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isBreakpointChanging, setIsBreakpointChanging] = useState(false);
  const initialLoadRef = useRef(false);
  const userInteractionRef = useRef(false);

  // Grid layout configuration
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 };
  const rowHeight = 80;

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BaseURL}/notes`);
      const sortedNotes = response.data.sort((a, b) => a.order - b.order);
      setNotes(sortedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      const loadData = async () => {
        await fetchNotes();
        await dispatch(fetchLayouts()).unwrap();
        // Fix any existing layouts that don't meet minimum constraints
        dispatch(fixLayoutConstraints());
      };
      loadData();
    }
  }, []); // Empty dependency array to run only once

  // Handle refresh trigger from parent component
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchNotes();
    }
  }, [refreshTrigger, fetchNotes]);

  // Generate layout for notes that don't have saved layouts
  const generateLayout = useCallback(() => {
    if (!notes.length) return [];

    const savedLayouts = layouts.reduce((acc, layout) => {
      acc[layout.noteId] = layout;
      return acc;
    }, {});

    return notes.map((note, index) => {
      const savedLayout = savedLayouts[note._id];
      if (savedLayout) {
        return {
          i: note._id,
          x: savedLayout.x,
          y: savedLayout.y,
          w: savedLayout.w || savedLayout.width || 3,
          h: savedLayout.h || savedLayout.height || 4,
          minW: 3,
          minH: 4,
          maxW: 12,
          maxH: 8,
        };
      }

      // Generate default layout for new notes
      const cols = 12;
      const cardWidth = 3;
      const cardHeight = 4;
      const x = (index * cardWidth) % cols;
      const y = Math.floor((index * cardWidth) / cols) * cardHeight;
      return {
        i: note._id,
        x: x,
        y: y,
        w: cardWidth,
        h: cardHeight,
        minW: 3,
        minH: 4,
        maxW: 12,
      };
    });
  }, [notes, layouts]);

  // Handle layout changes
  const handleLayoutChange = useCallback(
    (layout) => {
      // Don't save layout changes during breakpoint transitions
      if (isBreakpointChanging) {
        return;
      }

      // Only save if this was a user-initiated change
      if (!userInteractionRef.current) {
        return;
      }

      // Update local state immediately for smooth UX with minimum width enforcement
      const layoutUpdates = layout.map((item) => ({
        noteId: item.i,
        x: item.x,
        y: item.y,
        width: Math.max(item.w, 3), // Enforce minimum width of 3 columns
        height: Math.max(item.h, 4), // Enforce minimum height of 4 rows
      }));
      console.log("Layout updates:", layoutUpdates);

      dispatch(updateLocalLayouts(layoutUpdates));

      // Debounce the API call to avoid too many requests
      clearTimeout(window.layoutSaveTimeout);
      window.layoutSaveTimeout = setTimeout(() => {
        dispatch(batchUpdateLayouts(layoutUpdates));
        // Reset the user interaction flag after saving
        userInteractionRef.current = false;
      }, 1000);
    },
    [dispatch, isBreakpointChanging]
  );

  // Handle drag start to ensure proper collision detection
  const handleDragStart = useCallback(
    (layout, oldItem, newItem, placeholder, e, element) => {
      // Mark as user interaction
      userInteractionRef.current = true;

      // Prevent text selection during drag
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
      document.body.style.mozUserSelect = "none";
      document.body.style.msUserSelect = "none";

      // Add class to layout container to prevent selections
      const layoutContainer = document.querySelector(".react-grid-layout");
      if (layoutContainer) {
        layoutContainer.classList.add("react-grid-layout-dragging");
      }

      // Force re-render to ensure collision detection works properly
      element.style.zIndex = "1000";
    },
    []
  );

  // Handle drag stop to reset z-index
  const handleDragStop = useCallback(
    (layout, oldItem, newItem, placeholder, e, element) => {
      // Restore text selection
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      document.body.style.mozUserSelect = "";
      document.body.style.msUserSelect = "";

      // Remove class from layout container
      const layoutContainer = document.querySelector(".react-grid-layout");
      if (layoutContainer) {
        layoutContainer.classList.remove("react-grid-layout-dragging");
      }

      element.style.zIndex = "";
    },
    []
  );

  // Handle resize start to prevent text selection
  const handleResizeStart = useCallback(
    (layout, oldItem, newItem, placeholder, e, element) => {
      // Mark as user interaction
      userInteractionRef.current = true;

      // Prevent text selection during resize
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
      document.body.style.mozUserSelect = "none";
      document.body.style.msUserSelect = "none";

      // Add class to layout container to prevent selections
      const layoutContainer = document.querySelector(".react-grid-layout");
      if (layoutContainer) {
        layoutContainer.classList.add("react-grid-layout-resizing");
      }

      // Set higher z-index for resizing element
      element.style.zIndex = "1000";
    },
    []
  );

  // Handle resize stop to restore text selection
  const handleResizeStop = useCallback(
    (layout, oldItem, newItem, placeholder, e, element) => {
      // Restore text selection
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      document.body.style.mozUserSelect = "";
      document.body.style.msUserSelect = "";

      // Remove class from layout container
      const layoutContainer = document.querySelector(".react-grid-layout");
      if (layoutContainer) {
        layoutContainer.classList.remove("react-grid-layout-resizing");
      }

      // Reset z-index
      element.style.zIndex = "";
    },
    []
  );

  const handleBreakpointChange = useCallback((breakpoint) => {
    setCurrentBreakpoint(breakpoint);

    // Reset user interaction flag since this is an automatic change
    userInteractionRef.current = false;

    // Set flag to prevent saving during breakpoint transition
    setIsBreakpointChanging(true);

    // Clear the flag after a short delay to allow the layout to settle
    setTimeout(() => {
      setIsBreakpointChanging(false);
    }, 500);
  }, []);

  const handleEdit = (note) => {
    if (onEditNote) {
      onEditNote({
        id: note._id,
        title: note.title,
        paragraph: note.paragraph,
      });
    }
  };

  const handleDelete = (id) => {
    setNoteToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      await axios.delete(`${BaseURL}/notes/${noteToDelete}`);
      // Remove layout for deleted note
      dispatch(removeLocalLayout(noteToDelete));
      fetchNotes();
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Error deleting note");
    } finally {
      setNoteToDelete(null);
    }
  };

  // Get current layout for the grid (memoized to prevent unnecessary re-renders)
  const currentLayout = useMemo(() => generateLayout(), [generateLayout]);

  return (
    <div className="container mx-auto p-2">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <p className="text-2xl font-bold text-muted-foreground">
            No notes found
          </p>
          <p className="text-muted-foreground">
            Create your first note to get started!
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <ResponsiveGridLayout
            className="layout"
            layouts={{
              lg: currentLayout,
              md: currentLayout,
              sm: currentLayout,
              xs: currentLayout,
              xxs: currentLayout,
            }}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={rowHeight}
            onLayoutChange={handleLayoutChange}
            onBreakpointChange={handleBreakpointChange}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
            compactType="vertical"
            preventCollision={false}
            allowOverlap={false}
            isDraggable={true}
            isResizable={true}
            margin={[8, 8]}
            containerPadding={[0, 0]}
            useCSSTransforms={true}
            dragHandleClassName="drag-handle"
            autoSize={true}
            verticalCompact={true}
            isBounded={false}
            transformScale={1}
          >
            {notes.map((note) => (
              <div key={note._id} className="grid-item">
                <ParagraphCard
                  title={note.title}
                  paragraph={note.paragraph}
                  onEdit={() => handleEdit(note)}
                  onDelete={() => handleDelete(note._id)}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Are you sure?"
        description="This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="warning"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default NotesContainer;
