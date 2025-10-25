export default function Loading({ label = "Loading…" }) {
    return (
      <div className="flex items-center gap-3 text-bark">
        <span className="inline-block w-4 h-4 rounded-full border-2 border-bark border-t-transparent animate-spin" />
        <span className="text-sm">{label}</span>
      </div>
    );
  }
  