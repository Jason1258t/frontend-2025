import React from "react";
import { Trash2 } from "lucide-react";
import type { Slide } from "@/types";

import styles from "./SlidePreview.module.css";
import { useAppSelector } from "@/store";

interface SlidePreviewProps {
    slide: Slide;
    index: number;
    isActive: boolean;
    isSelected: boolean;
    canDelete: boolean;
    onSelect: (e: React.MouseEvent) => void;
    onDelete: () => void;
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
    onDragEnd: () => void; // ← ДОБАВЬТЕ ЭТО
    dragOverPosition: "before" | "after" | null;
    isDragging: boolean;
}

// Внутренний компонент SlideWidget для превью
interface SlideWidgetProps {
    slide: Slide;
    scale?: number;
}

const SlideWidget: React.FC<SlideWidgetProps> = ({ slide, scale = 0.15 }) => {
    return (
        <div
            className={styles.slideWidget}
            style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
            }}
        >
            <div
                className={styles.slide}
                style={{
                    backgroundColor: slide.theme.color,
                    backgroundImage: slide.theme.backgroundImage
                        ? `url(${slide.theme.backgroundImage})`
                        : "",
                }}
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
    isSelected,
    canDelete,
    onSelect,
    onDelete,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
    dragOverPosition,
    isDragging,
}) => {
    const content = useAppSelector(
        (state) => state.objects.objects[slide.id] ?? []
    );

    return (
        <li
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            onClick={onSelect}
            className={`${styles.slidePreview} ${isActive ? styles.active : ""} ${
                isSelected ? styles.selected : ""
            } ${isDragging ? styles.dragging : ""}`}
            data-drag-position={dragOverPosition}
        >
            {dragOverPosition === "before" && (
                <div className={styles.dropIndicator} />
            )}

            <div className={styles.aspectRatio}>
                <div className={styles.preview}>
                    <SlideWidget
                        slide={{ ...slide, content: content }}
                        scale={244 / 960}
                    />
                </div>
            </div>
            <div className={styles.title}>
                {index + 1}. {slide.id}
            </div>
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
                        <Trash2 size={14} color="#000" />
                    </button>
                )}
            </div>

            {dragOverPosition === "after" && (
                <div className={styles.dropIndicator} />
            )}
        </li>
    );
};

export default SlidePreview;
