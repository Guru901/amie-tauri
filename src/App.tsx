import React from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";

function App() {
  return (
    <div className="bg-transparent" data-tauri-drag-region>
      <Pet />
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
    <div>
      <img
        src={petSrc}
        alt="pet"
        draggable={false}
        onMouseDown={onMouseDown}
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
