import React from "react";
import type { SlideObject } from "@/types";

import styles from "./PropertiesPanel.module.css";

interface PropertiesPanelProps {
  element: SlideObject;
  onUpdate: (updates: Partial<SlideObject>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  element,
  onUpdate,
}) => {
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Свойства элемента</h3>
      <div className={styles.grid}>
        {element.type === "text" && (
          <>
            <div className={styles.field}>
              <label className={styles.label}>Размер шрифта</label>
              <input
                type="number"
                value={element.content.fontSize}
                onChange={(e) =>
                  onUpdate({
                    content: {
                      ...element.content,
                      fontSize: parseInt(e.target.value),
                    },
                  })
                }
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Цвет</label>
              <input
                type="color"
                value={element.content.color}
                onChange={(e) =>
                  onUpdate({
                    content: { ...element.content, color: e.target.value },
                  })
                }
                className={`${styles.colorInput} ${styles.input}`}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;
