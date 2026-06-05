import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchVariables,
  addVariable,
  updateVariable,
  deleteVariable,
  updateLocalVariableValue,
  COLOR_PALETTE,
} from "../store/variablesSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const ColorSwatches = ({ selected, onSelect }) => (
  <div className="flex flex-wrap gap-1.5">
    {COLOR_PALETTE.map((color) => (
      <button
        key={color}
        type="button"
        onClick={() => onSelect(color)}
        title={color}
        className="h-5 w-5 rounded-full border border-border flex items-center justify-center transition-transform hover:scale-110"
        style={{ backgroundColor: color }}
      >
        {selected === color && <Check className="h-3 w-3 text-white" />}
      </button>
    ))}
  </div>
);

const VariablePill = ({ variable }) => {
  const dispatch = useDispatch();
  const [showColors, setShowColors] = useState(false);
  const debounceRef = useRef(null);

  const handleValueChange = (e) => {
    const value = e.target.value;
    dispatch(updateLocalVariableValue({ id: variable._id, value }));
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(updateVariable({ id: variable._id, value }));
    }, 600);
  };

  const handleColor = (color) => {
    dispatch(updateVariable({ id: variable._id, color }));
    setShowColors(false);
  };

  const handleCopyKey = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(`{{${variable.key}}}`);
    toast.success("Copied to clipboard");
  };

  const handleDelete = () => {
    dispatch(deleteVariable(variable._id));
  };

  return (
    <div className="rounded-lg border border-border p-2 space-y-1.5 bg-card">
      <div className="flex items-center justify-between gap-1">
        <button
          type="button"
          onClick={handleCopyKey}
          title="Click to copy {{key}}"
          className="text-xs font-medium px-1.5 py-0.5 rounded cursor-pointer truncate max-w-[110px]"
          style={{
            backgroundColor: `${variable.color}33`,
            color: variable.color,
          }}
        >
          {`{{${variable.key}}}`}
        </button>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setShowColors((s) => !s)}
            title="Change color"
            className="h-5 w-5 rounded-full border border-border"
            style={{ backgroundColor: variable.color }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
            title="Delete variable"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {showColors && (
        <ColorSwatches selected={variable.color} onSelect={handleColor} />
      )}

      <Input
        type="text"
        value={variable.value}
        onChange={handleValueChange}
        placeholder={`Enter ${variable.key}...`}
        className="h-8 text-sm"
      />
    </div>
  );
};

const AddVariableForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const [key, setKey] = useState("");
  const [color, setColor] = useState(COLOR_PALETTE[0]);

  const handleAdd = async () => {
    const trimmed = key.trim();
    if (!trimmed) {
      toast.error("Variable name is required");
      return;
    }
    try {
      await dispatch(addVariable({ key: trimmed, color })).unwrap();
      onCancel();
    } catch (err) {
      toast.error(err || "Failed to add variable");
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-border p-2 space-y-2 bg-card">
      <Input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value.replace(/\s+/g, "_"))}
        placeholder="variableName"
        className="h-8 text-sm"
        autoFocus
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <ColorSwatches selected={color} onSelect={setColor} />
      <div className="flex gap-2">
        <Button size="sm" className="h-7 flex-1" onClick={handleAdd}>
          <Check className="h-3.5 w-3.5 mr-1" /> Add
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7"
          onClick={onCancel}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

const VariablesSidebar = ({ open = false, onClose }) => {
  const dispatch = useDispatch();
  const variables = useSelector((state) => state.variables.variables);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchVariables());
  }, [dispatch]);

  return (
    <>
      {/* Backdrop (mobile only, when drawer is open) */}
      {open && (
        <div
          className="fixed inset-0 top-16 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 z-40 w-64 overflow-y-auto border-r border-border bg-background p-4 space-y-4 transition-transform duration-300 lg:translate-x-0 lg:z-30",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between lg:hidden">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Variables
          </h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <h2 className="hidden text-sm font-semibold uppercase tracking-wide text-muted-foreground lg:block">
            Variables
          </h2>
          {variables.map((variable) => (
            <VariablePill key={variable._id} variable={variable} />
          ))}
        </div>

        {adding ? (
          <AddVariableForm onCancel={() => setAdding(false)} />
        ) : (
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => setAdding(true)}
          >
            <Plus className="h-4 w-4" />
            Add Variable
          </Button>
        )}
      </aside>
    </>
  );
};

export default VariablesSidebar;
