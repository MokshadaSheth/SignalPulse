import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw, CheckCircle2, AlertTriangle, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface JsonEditorProps {
  data: object | null;
  onSave: (jsonString: string) => boolean;
  onReset: () => void;
}

const JsonEditor = ({ data, onSave, onReset }: JsonEditorProps) => {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data) {
      const formatted = JSON.stringify(data, null, 2);
      setValue(formatted);
      setHasChanges(false);
    }
  }, [data]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setHasChanges(true);
    try {
      JSON.parse(newValue);
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  };

  const handleSave = () => {
    if (onSave(value)) {
      setHasChanges(false);
      toast.success("Data saved successfully");
    } else {
      toast.error("Invalid JSON — please fix errors before saving");
    }
  };

  const handleReset = () => {
    onReset();
    setHasChanges(false);
    setIsValid(true);
    toast.info("Data reset to original");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileJson className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold">Signal Pulse Data Editor</h3>
        </div>
        <div className="flex items-center gap-2">
          {isValid ? (
            <span className="sp-badge-green text-xs flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Valid JSON
            </span>
          ) : (
            <span className="sp-badge-amber text-xs flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Invalid JSON
            </span>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="relative rounded-xl border border-border overflow-hidden bg-card">
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full min-h-[400px] max-h-[600px] p-4 font-mono text-xs leading-relaxed bg-transparent text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring/20 rounded-xl"
          spellCheck={false}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={!isValid || !hasChanges}
          className="gap-2"
          size="sm"
        >
          <Save className="w-3.5 h-3.5" />
          Save Changes
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to Original
        </Button>
        {hasChanges && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground italic"
          >
            Unsaved changes
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};

export default JsonEditor;
