import { useState } from "react";

export default function ChatBotBox({ onSend }) {
  const [msg, setMsg] = useState("");

  const send = () => {
    const m = msg.trim();
    if (!m) return;
    onSend?.(m);
    setMsg("");
  };

  return (
    <div className="rounded-2xl border p-4 bg-white space-y-2">
      <div className="text-sm text-gray-700">
        Chat your meal request (placeholder). Example: “high-protein dinner using spinach”.
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-xl p-2"
          placeholder="Type a request…"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send} className="rounded-2xl bg-primary text-white px-4 py-2">
          Send
        </button>
      </div>
    </div>
  );
}
