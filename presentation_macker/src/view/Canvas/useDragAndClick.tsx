import { useState } from "react";

export const useDragAndClick = (
  onDragStart: (e: React.MouseEvent) => void,
  onClick: (e: React.MouseEvent) => void
) => {
  const [startPos, setStartPos] = useState<{x: number; y: number} | null>(null);
  
  return {
    onMouseDown: (e: React.MouseEvent) => {
      setStartPos({ x: e.clientX, y: e.clientY });
    },
    onMouseMove: (e: React.MouseEvent) => {
      if (!startPos) return;
      const moved = Math.abs(e.clientX - startPos.x) > 5 || 
                    Math.abs(e.clientY - startPos.y) > 5;
      if (moved) {
        onDragStart(e);
        setStartPos(null);
      }
    },
    onMouseUp: (e: React.MouseEvent) => {
      if (!startPos) return;
      const moved = Math.abs(e.clientX - startPos.x) > 5 || 
                    Math.abs(e.clientY - startPos.y) > 5;
      if (!moved) onClick(e);
      setStartPos(null);
    }
  };
};
