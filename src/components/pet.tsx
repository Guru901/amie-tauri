import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useMemo, useState } from "react";

export function Pet({ pet }: { pet: string }) {
  const petSrc = import.meta.env.DEV ? `/${pet}.gif` : `${pet}.gif`;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation when component mounts
    setIsVisible(true);
  }, []);

  const onMouseDown = async (e: React.MouseEvent) => {
    e.preventDefault();
    await getCurrentWindow().startDragging();
  };

  const floatVariantClass = useMemo(() => {
    const variant = Math.floor(Math.random() * 3);
    return `animate-float-${variant}`;
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center relative">
      <img
        src={petSrc}
        alt="pet"
        draggable={false}
        onMouseDown={onMouseDown}
        onContextMenu={(e) => e.preventDefault()}
        className={`
          select-none 
          ${floatVariantClass}
          transition-all duration-500 ease-in-out
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
        style={{
          width: pet === "cat" ? 150 : pet === "red-panda" ? 150 : 100,
          objectFit: "contain",
        }}
      />
    </div>
  );
}
