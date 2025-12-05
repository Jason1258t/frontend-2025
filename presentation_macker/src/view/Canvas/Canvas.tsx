import React, { useRef } from "react";

import styles from "./Canvas.module.css";
import {
    changeTextValue,
    selectCurrentSlide,
    selectCurrentSlideObjects,
    selectElements,
    useAppDispatch,
    useAppSelector,
} from "@/store";

interface CanvasProps {
    onMouseDown: (e: React.MouseEvent, elementId: string) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
}

const Canvas: React.FC<CanvasProps> = ({
    onMouseDown,
    onMouseMove,
    onMouseUp,
}) => {
    const dispatch = useAppDispatch();
    const slide = useAppSelector(selectCurrentSlide);
    const selectedIds =
        useAppSelector((state) => state.objects.objectSelection?.objects) ?? [];
    const elements = useAppSelector(selectCurrentSlideObjects);
    const canvasRef = useRef<HTMLDivElement>(null);

    if (!slide) return <h1>No slide</h1>;

    return (
        <div className={styles.canvasContainer}>
            <div className={styles.canvasWrapper}>
                <div
                    ref={canvasRef}
                    className={styles.canvas}
                    style={{
                        backgroundColor: slide.theme.color,
                        backgroundImage: slide.theme.backgroundImage
                            ? `url(${slide.theme.backgroundImage})`
                            : "none",
                    }}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onClick={() => {
                        dispatch(
                            selectElements({
                                slideId: slide.id,
                                objectIds: [],
                                clear: true,
                            })
                        );
                    }}
                >
                    {elements.map((element) => (
                        <div
                            key={element.id}
                            onMouseDown={(e) => {
                                dispatch(
                                    selectElements({
                                        slideId: slide.id,
                                        objectIds: [element.id],
                                        clear: !e.shiftKey,
                                    })
                                );
                                onMouseDown(e, element.id);
                            }}
                            className={`${styles.element} ${
                                selectedIds?.findIndex(
                                    (e) => e == element.id
                                ) != -1
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
                                        dispatch(
                                            changeTextValue({
                                                slideId: slide.id,
                                                objectId: element.id,
                                                newValue:
                                                    e.currentTarget
                                                        .textContent || "",
                                            })
                                        )
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
