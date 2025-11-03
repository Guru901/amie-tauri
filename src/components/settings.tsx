import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";

export default function Settings() {
  const [currentPet, setCurrentPet] = useState<string[]>(["cat", "hamster"]);
  const [alwaysOnTop, setAlwaysOnTop] = useState<boolean | undefined>(
    undefined
  );
  const [startOnLogin, setStartOnLogin] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    isEnabled().then((enabled) => {
      setStartOnLogin(enabled);
    });

    getAllWebviewWindows().then((windows) => {
      const mainWindow = windows.find((w) => w.label == "main");
      if (mainWindow) {
        mainWindow.isAlwaysOnTop().then((isOnTop) => {
          setAlwaysOnTop(isOnTop);
        });
      }
    });
  }, []);

  const handleAlwaysOnTopChange = async (checked: boolean) => {
    try {
      const windows = await getAllWebviewWindows();
      await Promise.all(
        windows.map((window) => window.setAlwaysOnTop(checked))
      );
      setAlwaysOnTop(checked);
    } catch (error) {
      console.error("Failed to set always on top:", error);
    }
  };

  const handleStartOnLoginChange = async (checked: boolean) => {
    try {
      if (checked) {
        await enable();
      } else {
        await disable();
      }
      setStartOnLogin(checked);
    } catch (error) {
      console.error("Failed to set start on login:", error);
    }
  };

  return (
    <div className="bg-background w-screen h-screen p-4 text-neutral-100">
      <h2 className="text-lg font-semibold mb-3">Settings</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <Label htmlFor="always-on-top">Always on top</Label>
          <Switch
            id="always-on-top"
            checked={alwaysOnTop}
            onCheckedChange={handleAlwaysOnTopChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="start-on-login">Start on login</Label>
          <Switch
            id="start-on-login"
            checked={startOnLogin}
            onCheckedChange={handleStartOnLoginChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="pet">Pet</Label>
          <ToggleGroup
            type="multiple"
            value={currentPet}
            onValueChange={setCurrentPet}
          >
            <ToggleGroupItem value="hamster">Hamster</ToggleGroupItem>
            <ToggleGroupItem value="cat">Cat</ToggleGroupItem>
            <ToggleGroupItem value="red-panda">Red Panda</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-400">
        More settings coming soon.
      </p>
    </div>
  );
}
