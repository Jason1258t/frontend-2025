import type { SlideObject } from "@/types";
import React from "react";

import styles from "./Canvas.module.css";
import { TextContent, ImageContent } from "./contents";
import {
    useAppDispatch,
    useAppSelector,
    selectCurrentSlide,
    selectElements,
} from "@/store";

interface SlideObjectWidgetProps {
    element: SlideObject;
        onMouseDown: (e: React.MouseEvent, elementId: string) => void;
}

const SlideObjectWidget: React.FC<SlideObjectWidgetProps> = ({ element, onMouseDown }) => {
    const dispatch = useAppDispatch();
    const slide = useAppSelector(selectCurrentSlide)!;
    const selectedIds =
        useAppSelector((state) => state.objects.objectSelection?.objects) ?? [];

    return (
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
                selectedIds?.findIndex((e) => e == element.id) != -1
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
                <TextContent content={element.content} elementId={element.id} />
            )}
            {element.type === "image" && (
                <ImageContent
                    content={element.content}
                    elementId={element.id}
                />
            )}
        </div>
    );
};

export default SlideObjectWidget;
