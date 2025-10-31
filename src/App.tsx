import React, { useEffect, useMemo, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";
import ContextWindow from "./components/context-window";
import Settings from "./components/settings";

function App() {
  const isSettings =
    typeof window !== "undefined" && window.location.hash === "#settings";

  // Initialize pet from localStorage, fallback to "cat"
  const [pet, setPet] = useState<"hamster" | "cat">(() => {
    const saved = localStorage.getItem("selectedPet");
    return saved === "hamster" || saved === "cat" ? saved : "cat";
  });

  useEffect(() => {
    // Listen for pet changes from settings window
    const setupListener = async () => {
      const unlisten = await getCurrentWindow().listen<{
        pet: "hamster" | "cat";
      }>("pet-changed", (event) => {
        console.log("Received pet-changed event:", event.payload.pet);
        setPet(event.payload.pet);
      });

      return unlisten;
    };

    const unlistenPromise = setupListener();

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  const handleSetPet = (newPet: "hamster" | "cat") => {
    console.log("Setting pet to:", newPet);
    setPet(newPet);
    localStorage.setItem("selectedPet", newPet);
  };

  return (
    <div className="bg-transparent">
      <ContextWindow />
      {isSettings ? (
        <Settings pet={pet} setPet={handleSetPet} />
      ) : (
        <Pet pet={pet} />
      )}
    </div>
  );
}

export default App;

function Pet({ pet }: { pet: "hamster" | "cat" }) {
  const petSrc = import.meta.env.DEV ? `/${pet}.gif` : `${pet}.gif`;

  const onMouseDown = async (e: React.MouseEvent) => {
    e.preventDefault();
    await getCurrentWindow().startDragging();
  };

  const floatVariantClass = useMemo(() => {
    const variant = Math.floor(Math.random() * 3);
    return `animate-float-${variant}`;
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <img
        src={petSrc}
        alt="pet"
        draggable={false}
        onMouseDown={onMouseDown}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        className={`select-none ${floatVariantClass}`}
        style={{
          width: pet == "cat" ? 150 : 100,
          objectFit: "cover",
        }}
      />
      <style>{`
        @keyframes float-variant-0 {
          0%   { transform: translateY(0px) translateX(0px) scale(1) rotate(0deg); }
          35%  { transform: translateY(-14px) translateX(18px) scale(1.08) rotate(2deg);}
          60%  { transform: translateY(-27px) translateX(10px) scale(1.1) rotate(-2deg);}
          100% { transform: translateY(-18px) translateX(22px) scale(1.08) rotate(0deg);}
        }
        @keyframes float-variant-1 {
          0%   { transform: translateY(0px) translateX(0px) scale(1) rotate(1deg);}
          24%  { transform: translateY(-12px) translateX(-16px) scale(1.04) rotate(0deg);}
          60%  { transform: translateY(-25px) translateX(12px) scale(1.12) rotate(-3deg);}
          100% { transform: translateY(-19px) translateX(-20px) scale(1.06) rotate(1deg);}
        }
        @keyframes float-variant-2 {
          0%   { transform: translateY(0px) translateX(0px) scale(1) rotate(-1deg);}
          27%  { transform: translateY(-17px) translateX(12px) scale(1.06) rotate(2deg);}
          77%  { transform: translateY(-23px) translateX(-16px) scale(1.13) rotate(-2deg);}
          100% { transform: translateY(-15px) translateX(22px) scale(1.09) rotate(-1deg);}
        }
        .animate-float-0 {
          animation: float-variant-0 3.4s ease-in-out infinite alternate;
        }
        .animate-float-1 {
          animation: float-variant-1 2.8s ease-in-out infinite alternate;
        }
        .animate-float-2 {
          animation: float-variant-2 3.2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
