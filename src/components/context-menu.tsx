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

  return (
    <ContextMenuContent className="border-none">
      <ContextMenuItem>Settings</ContextMenuItem>
      <ContextMenuItem variant="destructive" onClick={() => handleCloseApp()}>
        Close
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
