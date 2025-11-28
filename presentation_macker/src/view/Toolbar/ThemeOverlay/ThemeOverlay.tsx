import React, { useState, useEffect, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import styles from "./ThemeOverlay.module.css";
import { nanoid } from "nanoid";
import { dispatch, getEditor } from "@/editor/Editor";
import { changeBackground } from "@/utils/slides";
import { X } from "lucide-react";

const ThemeOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [color, setColor] = useState("#ffffff");
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const editor = getEditor();
    const currentSlide = editor.slidesCollection.slides.find(
      (s) => s.id === editor.currentSlideId
    );
    setColor(currentSlide?.theme.color || "#ffffff");
    setImage(currentSlide?.theme.backgroundImage || null);
  }, []);

  const onSave = () => {
    dispatch(changeBackground, {
      slideId: getEditor().currentSlideId!,
      background: {
        id: nanoid(),
        color: color,
        backgroundImage: image,
      },
    });

    onClose();
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    console.log("drag over");
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File): void => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Пожалуйста, выберите изображение");
    }
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <h3>Свойства фона</h3>
        <div className={styles.properties}>
          <div className={styles.property}>
            <h4>Цвет фона</h4>
            <input
              type="color"
              onChange={(e) => {
                setColor(e.target.value);
              }}
              value={color}
              style={{ border: "none", padding: 1 }}
            />
          </div>

          {image ? (
            <>
              <div className={`${styles.property} ${styles.start}`}>
                <h4>Выбранное изображение</h4>
                <div style={{ position: "relative" }}>
                  <img
                    src={image}
                   className={styles.preview}
                    alt=""
                  />
                  <button
                    className={styles.closePreview}
                    onClick={() => setImage(null)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.property}>
              <h4>Изображение фона</h4>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileInput}
                style={{
                  display: "none",
                }}
              />
              {
                <div
                  className={`${styles.dropZone} ${
                    isDragging ? styles.dragging : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <div className={styles.dropContent}>
                    <p>Перетащите изображение сюда или нажмите для выбора</p>
                    <span className={styles.dropHint}>
                      Поддерживаются: JPG, PNG, GIF
                    </span>
                  </div>
                </div>
              }
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={onClose}>Закрыть</button>
          <button onClick={onSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default ThemeOverlay;
