import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import GridLayout, { WidthProvider } from "react-grid-layout";
import ParagraphCard from "./ParagraphCard";
import axios from "axios";
import { toast } from "react-toastify";
import { BaseURL } from "../utils/BaseURL";
import ConfirmDialog from "./ConfirmDialog";
import {
  fetchLayouts,
  batchUpdateLayouts,
  removeLocalLayout,
} from "../store/layoutSlice";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./NotesContainer.css";

const Grid = WidthProvider(GridLayout);

// Grid constraints (kept in sync with the backend /layouts clamps)
const COLS = 12;
const ROW_HEIGHT = 80;
const CONSTRAINTS = { minW: 3, minH: 4, maxW: 8, maxH: 8 };
const DEFAULT_W = 4; // 3 cards per row by default
const DEFAULT_H = 4;

// maxW < COLS guarantees findFreeSlot always terminates.
const clampW = (w) =>
  Math.max(CONSTRAINTS.minW, Math.min(Math.round(w) || DEFAULT_W, CONSTRAINTS.maxW));
const clampH = (h) =>
  Math.max(CONSTRAINTS.minH, Math.min(Math.round(h) || DEFAULT_H, CONSTRAINTS.maxH));

// Find the first free slot scanning left-to-right, top-to-bottom, so new notes
// fill the current row before wrapping to the next one (and never overlap
// existing/dragged notes).
const findFreeSlot = (placed, w, h, cols) => {
  for (let y = 0; ; y++) {
    for (let x = 0; x + w <= cols; x++) {
      const collides = placed.some(
        (p) => x < p.x + p.w && x + w > p.x && y < p.y + p.h && y + h > p.y
      );
      if (!collides) return { x, y };
    }
  }
};

// Single column / stacked notes below the `lg` breakpoint.
const useIsMobile = () => {
  const query = "(max-width: 1023px)";
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
};

const NotesContainer = ({ refreshTrigger, resetSignal, onEditNote }) => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { layouts } = useSelector((state) => state.layout);
  const [notes, setNotes] = useState([]);
  // Live, unsaved drag/resize edits (id -> {x,y,w,h}); takes precedence over
  // persisted positions until the debounced save lands.
  const [localLayout, setLocalLayout] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const initialLoadRef = useRef(false);
  const saveTimeoutRef = useRef(null);

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

  // Initial load
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    const loadData = async () => {
      await fetchNotes();
      await dispatch(fetchLayouts()).unwrap();
    };
    loadData();
  }, [dispatch, fetchNotes]);

  // Refresh when parent triggers (note added/updated/deleted, layout reset)
  useEffect(() => {
    if (refreshTrigger > 0) fetchNotes();
  }, [refreshTrigger, fetchNotes]);

  // Clear local edits only on an explicit layout reset, so persisted defaults
  // take over. (Clearing on every `layouts` change caused a save→clear→save
  // feedback churn.)
  useEffect(() => {
    if (resetSignal > 0) setLocalLayout({});
  }, [resetSignal]);

  // Persisted positions keyed by note id.
  const savedMap = useMemo(() => {
    return layouts.reduce((acc, l) => {
      acc[String(l.noteId)] = l;
      return acc;
    }, {});
  }, [layouts]);

  // Complete, guaranteed-non-overlapping layout for every rendered note,
  // computed synchronously so a newly created note always has a valid position
  // (no (0,0) "orphan" overlap, and any corrupted/overlapping saved data is
  // self-healed). Precedence: live local edit > persisted > first free slot.
  // A preferred position is kept only if it fits the grid and doesn't collide
  // with an already-placed note; otherwise the note moves to the next free slot.
  const effectiveLayout = useMemo(() => {
    const placed = [];
    const collides = (a) =>
      placed.some(
        (p) => a.x < p.x + p.w && a.x + a.w > p.x && a.y < p.y + p.h && a.y + a.h > p.y
      );

    return notes.map((note) => {
      const id = note._id;
      const src = localLayout[id] || savedMap[id];
      const w = clampW(src?.w || src?.width);
      const h = clampH(src?.h || src?.height);

      let pos = null;
      if (src && Number.isFinite(src.x) && Number.isFinite(src.y)) {
        const cand = { x: src.x, y: src.y, w, h };
        const fitsGrid = cand.x >= 0 && cand.y >= 0 && cand.x + cand.w <= COLS;
        if (fitsGrid && !collides(cand)) pos = cand;
      }
      if (!pos) {
        pos = { ...findFreeSlot(placed, w, h, COLS), w, h };
      }

      placed.push(pos);
      return { i: id, ...pos, ...CONSTRAINTS };
    });
  }, [notes, savedMap, localLayout]);

  // Keep a ref to what's currently displayed so we can ignore no-op
  // onLayoutChange calls (RGL fires it on mount/compaction with no real change).
  const effectiveRef = useRef(effectiveLayout);
  effectiveRef.current = effectiveLayout;

  // Persist layout changes (debounced)
  const handleLayoutChange = useCallback(
    (newLayout) => {
      const current = effectiveRef.current.reduce((acc, l) => {
        acc[l.i] = l;
        return acc;
      }, {});

      const changed = newLayout.some((item) => {
        const c = current[item.i];
        return (
          !c || c.x !== item.x || c.y !== item.y || c.w !== item.w || c.h !== item.h
        );
      });
      if (!changed) return;

      setLocalLayout((prev) => {
        const next = { ...prev };
        newLayout.forEach((item) => {
          next[item.i] = { x: item.x, y: item.y, w: item.w, h: item.h };
        });
        return next;
      });

      const updates = newLayout.map((item) => ({
        noteId: item.i,
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      }));

      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        dispatch(batchUpdateLayouts(updates));
      }, 800);
    },
    [dispatch]
  );

  const setDragStyles = (on, element) => {
    const v = on ? "none" : "";
    document.body.style.userSelect = v;
    document.body.style.webkitUserSelect = v;
    if (element) element.style.zIndex = on ? "1000" : "";
  };

  const handleDragStart = useCallback((l, o, n, p, e, element) => {
    setDragStyles(true, element);
  }, []);
  const handleDragStop = useCallback((l, o, n, p, e, element) => {
    setDragStyles(false, element);
  }, []);
  const handleResizeStart = useCallback((l, o, n, p, e, element) => {
    setDragStyles(true, element);
  }, []);
  const handleResizeStop = useCallback((l, o, n, p, e, element) => {
    setDragStyles(false, element);
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
      dispatch(removeLocalLayout(noteToDelete));
      setLocalLayout((prev) => {
        const next = { ...prev };
        delete next[noteToDelete];
        return next;
      });
      fetchNotes();
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Error deleting note");
    } finally {
      setNoteToDelete(null);
    }
  };

  return (
    <div className="w-full">
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
      ) : isMobile ? (
        // Mobile: simple stacked single column (no drag/resize grid)
        <div className="flex flex-col gap-4">
          {notes.map((note) => (
            <div key={note._id} className="h-52">
              <ParagraphCard
                title={note.title}
                paragraph={note.paragraph}
                onEdit={() => handleEdit(note)}
                onDelete={() => handleDelete(note._id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <Grid
          className="layout"
          layout={effectiveLayout}
          cols={COLS}
          rowHeight={ROW_HEIGHT}
          onLayoutChange={handleLayoutChange}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          compactType="vertical"
          preventCollision={false}
          isDraggable
          isResizable
          margin={[12, 12]}
          containerPadding={[0, 0]}
          useCSSTransforms={false}
          dragHandleClassName="drag-handle"
          draggableCancel=".no-drag"
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
        </Grid>
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
