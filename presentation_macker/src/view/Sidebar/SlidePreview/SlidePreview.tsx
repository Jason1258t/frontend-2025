import React from "react";
import { Trash2 } from "lucide-react";
import type { Slide } from "@/types";

import styles from "./SlidePreview.module.css";

interface SlidePreviewProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

// Внутренний компонент SlideWidget для превью
interface SlideWidgetProps {
  slide: Slide;
  scale?: number;
}

const SlideWidget: React.FC<SlideWidgetProps> = ({
  slide,
  scale = 0.15, // Масштаб по умолчанию для превью
}) => {
  return (
    <div
      className={styles.slideWidget}
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      <div
        className={styles.slide}
        style={{ backgroundColor: slide.theme.color }}
      >
        {slide.content.map((element) => (
          <div
            key={element.id}
            className={styles.element}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.rect.width,
              height: element.rect.height,
            }}
          >
            {element.type === "text" && (
              <div
                className={styles.textElement}
                style={{
                  fontSize: element.content.fontSize,
                  color: element.content.color,
                  fontFamily: element.content.fontFamily,
                }}
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
  );
};

const SlidePreview: React.FC<SlidePreviewProps> = ({
  slide,
  index,
  isActive,
  canDelete,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`${styles.slidePreview} ${isActive ? styles.active : ""}`}
    >
      <div className={styles.aspectRatio}>
        <div className={styles.preview}>
          <SlideWidget slide={slide} scale={244 / 960} />
        </div>
      </div>
      <div className={styles.title}>{index + 1}.</div>
      <div className={styles.actions}>
        {canDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={`${styles.actionButton} ${styles.delete}`}
            title="Удалить"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SlidePreview;