import React, { forwardRef } from "react";
import styles from "./Sidebar.module.css";

interface DropZoneEndProps {
    isDragging: boolean;
    dragOverIndex: number | null;
    slidesCount: number;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (e: React.DragEvent) => void;
}

const DropZoneEnd = forwardRef<HTMLDivElement, DropZoneEndProps>(
    (
        {
            isDragging,
            dragOverIndex,
            slidesCount,
            onDragOver,
            onDragLeave,
            onDrop,
        },
        ref
    ) => {
        if (!isDragging) return null;

        return (
            <div
                ref={ref}
                className={styles.dropZoneEnd}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {dragOverIndex === slidesCount && (
                    <div className={styles.dropIndicatorEnd} />
                )}
                <div className={styles.dropZoneLabel}>Переместить в конец</div>
            </div>
        );
    }
);


export default DropZoneEnd;
