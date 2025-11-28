import React, { useRef } from "react";
import type { Slide, SlideObject } from "@/types";

import styles from "./Canvas.module.css";

interface CanvasProps {
  slide: Slide;
  selectedElements: SlideObject[] | null;
  onSelectElement: (id: string | null, add: boolean) => void;
  onUpdateElement: (elementId: string, updates: Partial<SlideObject>) => void;
  onMouseDown: (e: React.MouseEvent, elementId: string) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
  slide,
  selectedElements,
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
          style={{ backgroundColor: slide.theme.color, backgroundImage: slide.theme.backgroundImage ? `url(${slide.theme.backgroundImage})` : "none" }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClick={() => onSelectElement(null, false)}
        >
          {slide.content.map((element) => (
            <div
              key={element.id}
              onMouseDown={(e) => {
                onSelectElement(element.id, e.shiftKey);
                onMouseDown(e, element.id);
              }}
              className={`${styles.element} ${
                selectedElements?.findIndex((e) => e.id == element.id) != -1
                  ? styles.selected
                  : ""
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
                      type: "text",
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
                  onClick={(e) => e.stopPropagation()}
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
