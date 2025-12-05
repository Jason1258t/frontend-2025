import React, { useRef } from "react";

import styles from "./Canvas.module.css";
import {
    selectCurrentSlide,
    selectCurrentSlideObjects,
    selectElements,
    useAppDispatch,
    useAppSelector,
} from "@/store";
import { ImageContent, TextContent } from "./contents";

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
                                <TextContent
                                    content={element.content}
                                    elementId={element.id}
                                />
                            )}
                            {element.type === "image" && (
                                <ImageContent
                                    content={element.content}
                                    elementId={element.id}
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
