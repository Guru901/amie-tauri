import { getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";
import { useEffect, useState } from "react";
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";

type SettingsProps = {
  pet: "hamster" | "cat";
  setPet: (pet: "hamster" | "cat") => void;
};

export default function Settings({ pet, setPet }: SettingsProps) {
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);
  const [startOnLogin, setStartOnLogin] = useState(false);

  useEffect(() => {
    (async () => {
      const windows = await getAllWebviewWindows();
      const mainWindow = windows.find((w) => w.label == "main");
      if (mainWindow) {
        const isOnTop = await mainWindow.isAlwaysOnTop();
        setAlwaysOnTop(isOnTop);
      }
      const isAutoStart = await isEnabled();
      setStartOnLogin(isAutoStart);
    })();
  }, []);

  const toggleAlwaysOnTop = async () => {
    const newValue = !alwaysOnTop;
    setAlwaysOnTop(newValue);
    const windows = await getAllWebviewWindows();
    await Promise.all(windows.map((window) => window.setAlwaysOnTop(newValue)));
  };

  const toggleAutoStart = async () => {
    const newValue = !startOnLogin;
    setStartOnLogin(newValue);
    if (newValue) {
      await enable();
    } else {
      await disable();
    }
  };

  const handlePetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPet = e.target.value as "hamster" | "cat";
    console.log(newPet);
    setPet(newPet);

    // Save to localStorage so it persists across window reloads
    localStorage.setItem("selectedPet", newPet);

    // Reload the main window to apply the change
    (async () => {
      const windows = await getAllWebviewWindows();
      const mainWindow = windows.find((w) => w.label === "main");
      if (mainWindow) {
        await mainWindow.emit("pet-changed", { pet: newPet });
      }
    })();
  };

  return (
    <div className="w-screen h-screen p-4 text-neutral-100">
      <h2 className="text-lg font-semibold mb-3">Settings</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Always on top</span>
          <input
            type="checkbox"
            checked={alwaysOnTop}
            onChange={toggleAlwaysOnTop}
            className="cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Start on login</span>
          <input
            type="checkbox"
            checked={startOnLogin}
            onChange={toggleAutoStart}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Pet</span>
          <select value={pet} onChange={handlePetChange}>
            <option value="hamster">Hamster</option>
            <option value="cat">Cat</option>
          </select>
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-400">
        More settings coming soon.
      </p>
    </div>
  );
}
