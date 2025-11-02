import { useState } from "react";
import "./App.css";
import { Pet } from "./components/pet";
import { Button } from "./components/ui/button";

function App() {
  const [isCat, setIsCat] = useState(true);
  const [isHamster, setIsHamster] = useState(false);
  const [isRedPanda, setIsRedPanda] = useState(false);

  return (
    <div className="bg-transparent">
      {/* {isSettings ? (
        <Settings pet={pet} setPet={handleSetPet} />
      ) : (
        !isCat && !isHamster && !isRedPanda && <Pet pet={pet} />
      )} */}

      {isCat && <Pet pet="cat" />}
      {isHamster && <Pet pet="hamster" />}
      {isRedPanda && <Pet pet="red-panda" />}
    </div>
  );
}

export default App;
