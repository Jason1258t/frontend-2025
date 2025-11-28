import React from "react";
import { Type, ImageIcon, Trash2, Palette } from "lucide-react";
import { useState } from "react";

import styles from "./Toolbar.module.css";
import ThemeOverlay from "./ThemeOverlay";

interface ToolbarProps {
  selectedElement: any | null;
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
  const [showOverlay, setShowOverlay] = useState(false);

  const onChangeBackground = () => {
    setShowOverlay(true);
  };
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
        <button onClick={onChangeBackground} className={styles.toolButton}>
          <Palette size={20} />
          Сменить фон
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
      {showOverlay && <ThemeOverlay onClose={() => setShowOverlay(false)} />}
    </div>
  );
};

export default Toolbar;
