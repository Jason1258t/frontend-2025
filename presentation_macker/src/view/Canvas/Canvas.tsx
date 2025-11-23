import React, { useRef } from "react";
import type { Slide, SlideObject } from "@/types";

import styles from "./Canvas.module.css";

interface CanvasProps {
  slide: Slide;
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (elementId: string, updates: Partial<SlideObject>) => void;
  onMouseDown: (e: React.MouseEvent, elementId: string) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
  slide,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.canvasContainer}>
      <div className={styles.canvasWrapper}>
        <div
          ref={canvasRef}
          className={styles.canvas}
          style={{ backgroundColor: slide.theme.color }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClick={() => onSelectElement(null)}
        >
          {slide.content.map((element) => (
            <div
              key={element.id}
              onMouseDown={(e) => onMouseDown(e, element.id)}
              className={`${styles.element} ${
                selectedElement === element.id ? styles.selected : ""
              }`}
              style={{
                left: element.position.x,
                top: element.position.y,
                width: element.rect.width,
                height: element.rect.height,
              }}
            >
              {element.type === "text" && (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateElement(element.id, {
                      content: {
                        ...element.content,
                        value: e.currentTarget.textContent || "",
                      },
                    })
                  }
                  className={styles.textElement}
                  style={{
                    fontSize: element.content.fontSize,
                    color: element.content.color,
                    fontFamily: element.content.fontFamily,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {element.content.value}
                </div>
              )}
              {element.type === "image" && (
                <img
                  src={element.content.src}
                  alt="slide element"
                  className={styles.imageElement}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
