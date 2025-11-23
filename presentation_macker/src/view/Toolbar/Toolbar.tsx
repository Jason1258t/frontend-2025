import React from "react";
import { Type, ImageIcon, Trash2 } from "lucide-react";

import styles from "./Toolbar.module.css";

interface ToolbarProps {
  selectedElement: string | null;
  onAddText: () => void;
  onAddImage: () => void;
  onDeleteElement: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedElement,
  onAddText,
  onAddImage,
  onDeleteElement,
}) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarContent}>
        <button onClick={onAddText} className={styles.toolButton}>
          <Type size={20} />
          Текст
        </button>
        <button onClick={onAddImage} className={styles.toolButton}>
          <ImageIcon size={20} />
          Изображение
        </button>
        {selectedElement && (
          <button
            onClick={onDeleteElement}
            className={`${styles.toolButton} ${styles.deleteButton}`}
          >
            <Trash2 size={20} />
            Удалить элемент
          </button>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
