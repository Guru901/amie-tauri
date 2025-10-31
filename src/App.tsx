import React from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";
import ContextWindow from "./components/context-window";

function App() {
  const isSettings =
    typeof window !== "undefined" && window.location.hash === "#settings";
  return (
    <div
      className="bg-transparent"
      onClick={() => {
        console.log("here");
      }}
    >
      <ContextWindow />
      {isSettings ? <Settings /> : <Pet />}
    </div>
  );
}

export default App;

function Pet() {
  const petSrc = import.meta.env.DEV ? "/pet.gif" : "pet.gif";

  const onMouseDown = async (e: React.MouseEvent) => {
    e.preventDefault();
    await getCurrentWindow().startDragging();
  };

  return (
    <div className="relative">
      <img
        src={petSrc}
        alt="pet"
        draggable={false}
        onMouseDown={onMouseDown}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        className="select-none animate-float"
        style={{
          animation: "float 3s ease-in-out infinite alternate",
          width: 100,
          objectFit: "cover",
        }}
      />
      <style>{`
        @keyframes float {
          from { transform: translateY(0); }
          to { transform: translateY(-20px) scale(1.1) translateX(20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}

function Settings() {
  return (
    <div className="min-w-[320px] min-h-[280px] p-4 text-neutral-100 bg-neutral-900/95">
      <h2 className="text-lg font-semibold mb-3">Settings</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Always on top</span>
          <input type="checkbox" className="accent-neutral-300" disabled />
        </div>
        <div className="flex items-center justify-between">
          <span>Start on login</span>
          <input type="checkbox" className="accent-neutral-300" disabled />
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-400">
        More settings coming soon.
      </p>
    </div>
  );
}
