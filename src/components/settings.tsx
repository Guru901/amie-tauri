import {
  getAllWebviewWindows,
  WebviewWindow,
} from "@tauri-apps/api/webviewWindow";
import { useEffect, useState } from "react";
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";

type SettingsProps = {
  pet: string;
  setPet: (pet: string) => void;
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
    const newPet = e.target.value;
    const currentPet = pet;
    setPet(newPet);

    if (e.target.value === "all") {
      // Check if window already exists before creating
      (async () => {
        const windows = await getAllWebviewWindows();
        const secondPetWindow = windows.find((w) => w.label === "second-pet");

        if (!secondPetWindow) {
          try {
            new WebviewWindow("second-pet", {
              url: `#${currentPet === "cat" ? "hamster" : "cat"}`,
              width: 200,
              title: currentPet === "cat" ? "hamster" : "cat",
              height: 200,
              resizable: true,
              alwaysOnTop: true,
              transparent: true,
              decorations: false,
            });
          } catch (error) {
            console.error("Failed to create second pet window:", error);
          }
        }
      })();
    } else {
      // Close second pet window when switching away from "all" mode
      (async () => {
        const windows = await getAllWebviewWindows();
        console.log("windows", windows);
        const secondPetWindow = windows.find((w) => w.label === "second-pet");
        console.log("secondPetWindow", secondPetWindow);
        if (secondPetWindow) {
          try {
            await secondPetWindow.close();
          } catch (error) {
            console.error("Failed to close second pet window:", error);
          }
        }

        // Save to localStorage so it persists across window reloads
        localStorage.setItem("selectedPet", newPet);

        // Reload the main window to apply the change
        const mainWindow = windows.find((w) => w.label === "main");
        if (mainWindow) {
          await mainWindow.emit("pet-changed", { pet: newPet });
        }
      })();
    }
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
            <option value="all">All</option>
          </select>
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-400">
        More settings coming soon.
      </p>
    </div>
  );
}
