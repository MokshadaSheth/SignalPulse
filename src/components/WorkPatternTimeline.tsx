import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TimeBlock {
  id: string;
  start: string;
  end: string;
  type: "deep" | "fragmented" | "idle";
  label: string;
}

const blocks: TimeBlock[] = [
  { id: "1", start: "9:00", end: "9:45", type: "fragmented", label: "Fragmented Work" },
  { id: "2", start: "9:45", end: "10:30", type: "idle", label: "Stagnation" },
  { id: "3", start: "10:30", end: "12:00", type: "deep", label: "Hyper-Focus" },
  { id: "4", start: "12:00", end: "13:00", type: "idle", label: "Break" },
  { id: "5", start: "13:00", end: "14:30", type: "deep", label: "Hyper-Focus" },
  { id: "6", start: "14:30", end: "15:15", type: "fragmented", label: "Fragmented Work" },
  { id: "7", start: "15:15", end: "16:00", type: "deep", label: "Hyper-Focus" },
  { id: "8", start: "16:00", end: "17:00", type: "fragmented", label: "Fragmented Work" },
];

const typeStyles = {
  deep: { bg: "bg-sp-green", dot: "🟢", color: "text-sp-green" },
  fragmented: { bg: "bg-sp-amber", dot: "🟡", color: "text-sp-amber" },
  idle: { bg: "bg-sp-blue", dot: "🔵", color: "text-sp-blue" },
};

const WorkPatternTimeline = () => {
  return (
    <motion.div
      className="sp-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Work Pattern Analyzer</h3>
        <div className="sp-privacy-note">
          <Shield className="w-3.5 h-3.5" />
          <span>Only you can see this data</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-5">
        {(["deep", "fragmented", "idle"] as const).map((type) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{typeStyles[type].dot}</span>
            <span className="capitalize">
              {type === "deep" ? "Hyper-Focus" : type === "fragmented" ? "Fragmented" : "Stagnation"}
            </span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="flex gap-1.5 h-14 items-end">
        {blocks.map((block, i) => {
          const style = typeStyles[block.type];
          return (
            <Tooltip key={block.id}>
              <TooltipTrigger asChild>
                <motion.div
                  className={`${style.bg} rounded-lg flex-1 cursor-pointer transition-all hover:opacity-80`}
                  style={{
                    height: block.type === "deep" ? "100%" : block.type === "fragmented" ? "65%" : "35%",
                    opacity: 0.75,
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                  whileHover={{ scale: 1.05 }}
                />
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                <p className="font-medium">{block.label}</p>
                <p className="text-muted-foreground">{block.start} – {block.end}</p>
                <p className="text-muted-foreground italic mt-1">No app names tracked</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>9:00</span>
        <span>12:00</span>
        <span>15:00</span>
        <span>17:00</span>
      </div>
    </motion.div>
  );
};

export default WorkPatternTimeline;
