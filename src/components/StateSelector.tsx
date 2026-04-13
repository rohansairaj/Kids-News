import { useState } from "react";
import { indianStates, IndianState } from "@/data/newsTypes";
import { MapPin, ChevronDown } from "lucide-react";

interface StateSelectorProps {
  selected: string;
  onChange: (state: string) => void;
}

const StateSelector = ({ selected, onChange }: StateSelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border-2 border-border font-bold text-sm hover:border-primary/50 transition-all"
      >
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-foreground">{selected || "Select State"}</span>
        <span className="text-xs text-muted-foreground">🇮🇳</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-64 max-h-60 overflow-y-auto bg-card border-2 border-border rounded-2xl shadow-xl p-2">
          {indianStates.map((state) => (
            <button
              key={state}
              onClick={() => {
                onChange(state);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                selected === state
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StateSelector;
