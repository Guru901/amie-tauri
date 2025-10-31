import React from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";
import ContextWindow from "./components/context-window";
import Settings from "./components/settings";

function App() {
  const isSettings =
    typeof window !== "undefined" && window.location.hash === "#settings";

  return (
    <div className="bg-transparent">
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
