import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { ContextMenuContent, ContextMenuItem } from "./ui/context-menu";
import { exit } from "@tauri-apps/plugin-process";

export default function ContextMenuComponent() {
  const handleCloseApp = async () => {
    try {
      await exit(0);
    } catch (error) {
      console.error("Failed to close app:", error);
    }
  };

  const handleSettings = async () => {
    try {
      new WebviewWindow("settings", {
        url: "#settings",
        title: "Settings",
        width: 400,
        height: 300,
        resizable: true,
        alwaysOnTop: true,
      });
    } catch (error) {
      console.error("Failed to open settings window:", error);
    }
  };

  return (
    <ContextMenuContent className="border-none">
      <ContextMenuItem onClick={() => handleSettings()}>
        Settings
      </ContextMenuItem>
      <ContextMenuItem variant="destructive" onClick={() => handleCloseApp()}>
        Close
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
