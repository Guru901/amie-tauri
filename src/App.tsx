import { useState } from "react";
import "./App.css";
import { Pet } from "./components/pet";
import { ContextMenu, ContextMenuTrigger } from "./components/ui/context-menu";
import ContextMenuComponent from "./components/context-menu";
import Settings from "./components/settings";

function App() {
  const isSettings =
    typeof window !== "undefined" && window.location.hash === "#settings";

  const isCat =
    typeof window !== "undefined" && window.location.hash === "#cat";
  const isHamster =
    typeof window !== "undefined" && window.location.hash === "#hamster";
  const isRedPanda =
    typeof window !== "undefined" && window.location.hash === "#red-panda";

  const [pet] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem("selectedPets");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (
            Array.isArray(parsed) &&
            parsed.length > 0 &&
            typeof parsed[0] === "string"
          ) {
            return parsed[0];
          }
        }
      }
    } catch (_) {
      return "cat";
    }
    return "cat";
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div>
          {isSettings ? (
            <Settings />
          ) : (
            !isCat && !isHamster && !isRedPanda && <Pet pet={pet} />
          )}

          {isCat && <Pet pet="cat" />}
          {isHamster && <Pet pet="hamster" />}
          {isRedPanda && <Pet pet="red-panda" />}
        </div>
      </ContextMenuTrigger>
      <ContextMenuComponent />
    </ContextMenu>
  );
}

export default App;
