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
const CONSTRAINTS = { minW: 3, minH: 4, maxW: 12, maxH: 8 };
const DEFAULT_W = 4; // 3 cards per row by default
const DEFAULT_H = 4;

const clampW = (w) =>
  Math.max(CONSTRAINTS.minW, Math.min(Math.round(w) || DEFAULT_W, CONSTRAINTS.maxW));
const clampH = (h) =>
  Math.max(CONSTRAINTS.minH, Math.min(Math.round(h) || DEFAULT_H, CONSTRAINTS.maxH));

// First free slot scanning left-to-right, top-to-bottom (w <= cols → terminates).
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

// Pinned first (newest pin first), then newest created first.
const sortNotes = (arr) =>
  [...arr].sort((a, b) => {
    const pa = a.pinned ? 1 : 0;
    const pb = b.pinned ? 1 : 0;
    if (pa !== pb) return pb - pa;
    if (pa === 1) return new Date(b.pinnedAt || 0) - new Date(a.pinnedAt || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

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

const NotesContainer = ({
  notes = [],
  loading = false,
  resetSignal,
  filterTags = [],
  onEditNote,
  onDeleted,
  onTogglePin,
}) => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { layouts } = useSelector((state) => state.layout);
  // Live, unsaved drag/resize edits (id -> {x,y,w,h}).
  const [localLayout, setLocalLayout] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const saveTimeoutRef = useRef(null);

  const sortedNotes = useMemo(() => {
    const filtered = filterTags.length
      ? notes.filter((n) => (n.tags || []).some((t) => filterTags.includes(t)))
      : notes;
    return sortNotes(filtered);
  }, [notes, filterTags]);

  // Load persisted layouts once
  useEffect(() => {
    dispatch(fetchLayouts());
  }, [dispatch]);

  // Clear local edits on an explicit layout reset, so persisted defaults take over.
  useEffect(() => {
    if (resetSignal > 0) setLocalLayout({});
  }, [resetSignal]);

  const savedMap = useMemo(() => {
    return layouts.reduce((acc, l) => {
      acc[String(l.noteId)] = l;
      return acc;
    }, {});
  }, [layouts]);

  // Notes flow in sorted order (pinned → newest), packed top-left, so pinned
  // and newly created notes always appear on top. Persisted *size* (w/h) is
  // kept, and an in-session drag is respected; positions otherwise re-pack.
  const effectiveLayout = useMemo(() => {
    const placed = [];
    const collides = (a) =>
      placed.some(
        (p) => a.x < p.x + p.w && a.x + a.w > p.x && a.y < p.y + p.h && a.y + a.h > p.y
      );

    return sortedNotes.map((note) => {
      const id = note._id;
      const local = localLayout[id];
      const saved = savedMap[id];
      const w = clampW((local || saved)?.w || (local || saved)?.width);
      const h = clampH((local || saved)?.h || (local || saved)?.height);

      // A drag this session is respected; otherwise pack into the next free slot.
      let pos = null;
      if (local && Number.isFinite(local.x) && Number.isFinite(local.y)) {
        const cand = { x: local.x, y: local.y, w, h };
        const fits = cand.x >= 0 && cand.y >= 0 && cand.x + cand.w <= COLS;
        if (fits && !collides(cand)) pos = cand;
      }
      if (!pos) pos = { ...findFreeSlot(placed, w, h, COLS), w, h };

      placed.push(pos);
      return { i: id, ...pos, ...CONSTRAINTS };
    });
  }, [sortedNotes, savedMap, localLayout]);

  // Persist a layout that resulted from an explicit user drag/resize.
  const persistLayout = useCallback(
    (newLayout) => {
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
  const handleDragStop = useCallback(
    (layout, o, n, p, e, element) => {
      setDragStyles(false, element);
      persistLayout(layout);
    },
    [persistLayout]
  );
  const handleResizeStart = useCallback((l, o, n, p, e, element) => {
    setDragStyles(true, element);
  }, []);
  const handleResizeStop = useCallback(
    (layout, o, n, p, e, element) => {
      setDragStyles(false, element);
      persistLayout(layout);
    },
    [persistLayout]
  );

  const handleEdit = (note) => {
    if (onEditNote) {
      onEditNote({
        id: note._id,
        title: note.title,
        paragraph: note.paragraph,
        tags: note.tags || [],
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
      onDeleted?.(noteToDelete);
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Error deleting note");
    } finally {
      setNoteToDelete(null);
    }
  };

  const cardProps = (note) => ({
    title: note.title,
    paragraph: note.paragraph,
    tags: note.tags || [],
    pinned: !!note.pinned,
    onEdit: () => handleEdit(note),
    onDelete: () => handleDelete(note._id),
    onTogglePin: () => onTogglePin?.(note),
  });

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : sortedNotes.length === 0 ? (
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
          {sortedNotes.map((note) => (
            <div key={note._id} className="h-52">
              <ParagraphCard {...cardProps(note)} />
            </div>
          ))}
        </div>
      ) : (
        <Grid
          className="layout"
          layout={effectiveLayout}
          cols={COLS}
          rowHeight={ROW_HEIGHT}
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
          {sortedNotes.map((note) => (
            <div key={note._id} className="grid-item">
              <ParagraphCard {...cardProps(note)} />
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
