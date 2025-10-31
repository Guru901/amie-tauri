import { getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";
import { useEffect, useState } from "react";

export default function Settings() {
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);

  useEffect(() => {
    (async () => {
      const windows = await getAllWebviewWindows();
      // Find the main window (not the settings window)
      const mainWindow = windows.find((w) => w.label == "main");
      console.log(mainWindow);
      if (mainWindow) {
        const isOnTop = await mainWindow.isAlwaysOnTop();
        setAlwaysOnTop(isOnTop);
      }
    })();
  }, []);

  const toggleAlwaysOnTop = async () => {
    const newValue = !alwaysOnTop;
    setAlwaysOnTop(newValue);

    // Apply to all windows
    const windows = await getAllWebviewWindows();
    await Promise.all(windows.map((window) => window.setAlwaysOnTop(newValue)));
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
          <input type="checkbox" className="" />
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-400">
        More settings coming soon.
      </p>
    </div>
  );
}
