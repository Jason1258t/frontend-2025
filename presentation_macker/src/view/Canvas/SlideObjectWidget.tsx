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
import ObjectControls from "./ObjectControls";
import type { ResizeType } from "./resize";

interface SlideObjectWidgetProps {
    element: SlideObject;
    onMouseDown: (e: React.MouseEvent) => void;
    changedPosition?: Position;
    changedSize?: Size;
    onResizeStart?: (
        e: React.MouseEvent,
        type: ResizeType,
        elementId: string
    ) => void;
}

const SlideObjectWidget: React.FC<SlideObjectWidgetProps> = ({
    element,
    onMouseDown,
    changedPosition,
    changedSize,
    onResizeStart,
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
    const isSelected = selectedIds?.findIndex((e) => e == element.id) != -1;

    return (
        <>
            {isSelected && (
                <ObjectControls
                    position={changedPosition ?? element.position}
                    rect={changedSize ?? element.rect}
                    onResizeStart={(e, t) => {
                        if (onResizeStart) {
                            onResizeStart(e, t, element.id);
                        }
                    }}
                />
            )}
            <div
                key={element.id}
                {...handlers}
                className={`${styles.element} ${isSelected ? "" : ""}`}
                style={{
                    left: changedPosition?.x ?? element.position.x,
                    top: changedPosition?.y ?? element.position.y,
                    width: changedSize?.width ?? element.rect.width,
                    height: changedSize?.height ?? element.rect.height,
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
        </>
    );
};

export default SlideObjectWidget;
