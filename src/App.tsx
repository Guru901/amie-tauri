import React, { useEffect, useMemo, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";
import ContextWindow from "./components/context-window";
import Settings from "./components/settings";

function App() {
  const isSettings =
    typeof window !== "undefined" && window.location.hash === "#settings";

  const isCat =
    typeof window !== "undefined" && window.location.hash === "#cat";
  const isHamster =
    typeof window !== "undefined" && window.location.hash === "#hamster";

  // Initialize pet from localStorage, fallback to "cat"
  const [pet, setPet] = useState<string>(() => {
    return localStorage.getItem("selectedPet") || "cat";
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

  const handleSetPet = (newPet: string) => {
    setPet(newPet);
    if (newPet !== "all") {
      localStorage.setItem("selectedPet", newPet);
    }
  };

  return (
    <div className="bg-transparent">
      <ContextWindow />
      {isSettings ? (
        <Settings pet={pet} setPet={handleSetPet} />
      ) : (
        !isCat && !isHamster && <Pet pet={pet} />
      )}

      {isCat && <Pet pet="cat" />}
      {isHamster && <Pet pet="hamster" />}
    </div>
  );
}

export default App;

function Pet({ pet }: { pet: string }) {
  const petSrc = import.meta.env.DEV ? `/${pet}.gif` : `${pet}.gif`;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation when component mounts
    setIsVisible(true);
  }, []);

  const onMouseDown = async (e: React.MouseEvent) => {
    e.preventDefault();
    await getCurrentWindow().startDragging();
  };

  const floatVariantClass = useMemo(() => {
    const variant = Math.floor(Math.random() * 3);
    return `animate-float-${variant}`;
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center relative">
      <img
        src={petSrc}
        alt="pet"
        draggable={false}
        onMouseDown={onMouseDown}
        onContextMenu={(e) => e.preventDefault()}
        className={`
        select-none 
        ${floatVariantClass}
        transition-all duration-500 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
        style={{
          width: pet === "cat" ? 150 : 100,
          objectFit: "contain",
        }}
      />
    </div>
  );
}
