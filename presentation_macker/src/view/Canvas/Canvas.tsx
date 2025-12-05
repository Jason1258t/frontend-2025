import React, { useRef } from "react";

import styles from "./Canvas.module.css";
import {
    selectCurrentSlide,
    selectCurrentSlideObjects,
    selectElements,
    useAppDispatch,
    useAppSelector,
} from "@/store";
import SlideObjectWidget from "./SlideObjectWidget";

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
                        <SlideObjectWidget
                            element={element}
                            onMouseDown={onMouseDown}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Canvas;
