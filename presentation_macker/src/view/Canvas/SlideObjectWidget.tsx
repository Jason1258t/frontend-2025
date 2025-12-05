import type { Position, SlideObject, Size } from "@/types";
import React from "react";

import styles from "./Canvas.module.css";
import { TextContent, ImageContent } from "./contents";
import {
    useAppDispatch,
    useAppSelector,
    selectCurrentSlide,
    selectElements,
} from "@/store";
import { useDragAndClick } from "./useDragAndClick";

interface SlideObjectWidgetProps {
    element: SlideObject;
    onMouseDown: (e: React.MouseEvent) => void;
    changedPosition?: Position;
    changedSize?: Size;
}

const SlideObjectWidget: React.FC<SlideObjectWidgetProps> = ({
    element,
    onMouseDown,
    changedPosition,
    changedSize,
}) => {
    const dispatch = useAppDispatch();
    const slide = useAppSelector(selectCurrentSlide)!;
    const selectedIds =
        useAppSelector((state) => state.objects.objectSelection?.objects) ?? [];

    const onClick = (e: React.MouseEvent) => {
        console.log("select el");
        dispatch(
            selectElements({
                slideId: slide.id,
                objectIds: [element.id],
                clear: !e.shiftKey,
            })
        );
    };

    const handlers = useDragAndClick(onMouseDown, onClick);
    return (
        <div
            key={element.id}
            {...handlers}
            className={`${styles.element} ${
                selectedIds?.findIndex((e) => e == element.id) != -1
                    ? styles.selected
                    : ""
            }`}
            style={{
                left: changedPosition?.x ?? element.position.x,
                top: changedPosition?.y ?? element.position.y,
                width: changedSize?.width ?? element.rect.width,
                height: changedSize?.height ?? element.rect.height,
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
