import { useState } from "react";
import "./App.css";
import { Pet } from "./components/pet";
import { ContextMenu, ContextMenuTrigger } from "./components/ui/context-menu";
import ContextMenuComponent from "./components/context-menu";

function App() {
  const [isCat, setIsCat] = useState(true);
  const [isHamster, setIsHamster] = useState(false);
  const [isRedPanda, setIsRedPanda] = useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div>
          {/* {isSettings ? (
          <Settings pet={pet} setPet={handleSetPet} />
        ) : (
          !isCat && !isHamster && !isRedPanda && <Pet pet={pet} />
        )} */}

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
