export default function PreferenceSlider({ label, value, onChange }) {
    const labels = ["Avoid (allergy/rule)", "Limit", "Occasionally", "Fine", "Prefer", "Prioritize"];
  
    return (
      <div className="flex items-center gap-4">
        <div className="w-32 text-sm font-medium capitalize">{label}</div>
  
        <div className="flex flex-col">
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-56"
            aria-label={`${label} preference`}
          />
          {/* optional tiny scale helper */}
          <div className="flex justify-between text-[11px] text-gray-500 mt-1 w-56">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
          </div>
        </div>
  
        <div className="text-xs text-gray-600 w-40">{labels[value] || value}</div>
      </div>
    );
  }
  