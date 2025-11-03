import { useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  getAllWebviewWindows,
  WebviewWindow,
} from "@tauri-apps/api/webviewWindow";
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";

export default function Settings() {
  const [currentPet, setCurrentPet] = useState<string[]>(["cat"]);
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

  const handlePetChange = async (value: string[]) => {
    try {
      const allowedPets = new Set(["cat", "hamster", "red-panda"]);

      // sanitize, dedupe, and validate incoming values
      let next = Array.from(new Set(value.filter((v) => allowedPets.has(v))));
      if (next.length === 0) {
        next = ["cat"]; // ensure at least one pet is selected
      }

      const windows = await getAllWebviewWindows();

      // Close windows for pets that were deselected
      await Promise.all(
        currentPet
          .filter((p) => !next.includes(p))
          .map(async (p) => {
            const win = windows.find((w) => w.label === p);
            if (win) {
              try {
                await win.close();
              } catch (err) {
                console.warn(`Failed to close window for ${p}:`, err);
              }
            }
          })
      );

      // Open windows for newly selected pets (if not already open)
      await Promise.all(
        next
          .filter((p) => !currentPet.includes(p))
          .map(async (p) => {
            const existing = windows.find((w) => w.label === p);
            if (!existing) {
              try {
                new WebviewWindow(p, {
                  url: `#${p}`,
                  width: 200,
                  title: p,
                  height: 150,
                  resizable: true,
                  alwaysOnTop: true,
                  transparent: true,
                  decorations: false,
                });
              } catch (err) {
                console.warn(`Failed to open window for ${p}:`, err);
              }
            }
          })
      );

      setCurrentPet(next);

      // persist selection
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("selectedPets", JSON.stringify(next));
        }
      } catch (storageErr) {
        console.warn("Failed to persist selected pets:", storageErr);
      }
    } catch (error) {
      console.error("Failed to change pets:", error);
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
            onValueChange={handlePetChange}
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
