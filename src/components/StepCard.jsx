export default function StepCard({ title, children }) {
    return (
      <div className="rounded-3xl border border-bark/10 p-5 md:p-6 shadow-sm bg-white">
        <h3 className="text-lg font-semibold mb-3 text-bark">{title}</h3>
        {children}
      </div>
    );
  }
  