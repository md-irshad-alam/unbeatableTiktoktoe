import { useState } from "react";

export default function ToggleTailwind() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex items-center justify-center p-4">
      <button
        onClick={() => setEnabled(!enabled)}
        className={`px-6 py-2  font-bold rounded-full shadow-md hover:bg-purple-100 hover:scale-105 transition duration-300 ${
          enabled ? "bg-red-600" : "bg-white text-black"
        }`}
      >
        {enabled ? "Unbeatable Mode" : "Normal Mode"}
      </button>
    </div>
  );
}
