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
        <div
          className={styles.preview}
          style={{ backgroundColor: slide.theme.color }}
        >
          <div></div>
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
