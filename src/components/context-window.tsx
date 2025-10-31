import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { exit } from "@tauri-apps/plugin-process";

type MenuPosition = { x: number; y: number };

export default function ContextWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Open menu on right-click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setPosition({ x: e.clientX, y: e.clientY });
      setIsOpen(true);
    };
    document.addEventListener("contextmenu", handleContextMenu, true);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside, true);
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Keep menu within viewport
  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const padding = 4;
    let x = position.x;
    let y = position.y;
    if (x + rect.width > window.innerWidth - padding)
      x = window.innerWidth - rect.width - padding;
    if (y + rect.height > window.innerHeight - padding)
      y = window.innerHeight - rect.height - padding;
    if (x < padding) x = padding;
    if (y < padding) y = padding;
    if (x !== position.x || y !== position.y) setPosition({ x, y });
  }, [isOpen, position.x, position.y]);

  const handleSettings = async () => {
    try {
      // Check if settings window already exists
      const allWindows = WebviewWindow.getAll();
      const settingsWindow = (await allWindows).find(
        (w) => w.label === "settings"
      );

      if (settingsWindow) {
        // If it exists, focus it
        await settingsWindow.setFocus();
      } else {
        // Create new settings window
        const newWindow = new WebviewWindow("settings", {
          url: "/settings", // or your settings route
          title: "Settings",
          width: 600,
          height: 400,
          resizable: true,
          center: true,
        });

        // Listen for window creation
        newWindow.once("tauri://created", () => {
          console.log("Settings window created");
        });

        newWindow.once("tauri://error", (e) => {
          console.error("Error creating settings window:", e);
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to open settings window:", error);
    }
  };

  const handleCloseApp = async () => {
    try {
      await exit(0);
    } catch (error) {
      console.error("Failed to close app:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] min-w-[140px] rounded border border-neutral-700/60 bg-neutral-900/95 text-neutral-100 shadow-xl backdrop-blur-sm"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <ul className="py-0.5 text-xs m-0 list-none">
        <li>
          <button
            onClick={handleSettings}
            className="w-full px-2 py-0.5 text-left hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none"
          >
            Settings
          </button>
        </li>
        <li className="my-0.5 h-px bg-neutral-800" />
        <li>
          <button
            onClick={handleCloseApp}
            className="w-full px-2 py-0.5 text-left text-red-300 hover:bg-red-900/30 focus:bg-red-900/30 focus:outline-none"
          >
            Close program
          </button>
        </li>
      </ul>
    </div>
  );
}
