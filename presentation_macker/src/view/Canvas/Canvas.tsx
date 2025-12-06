import React, { useRef, useState } from "react";

import styles from "./Canvas.module.css";
import {
    moveObjectOnSlide,
    resizeObjectOnSlide,
    selectCurrentSlide,
    selectCurrentSlideObjects,
    selectElements,
    useAppDispatch,
    useAppSelector,
} from "@/store";
import SlideObjectWidget from "./SlideObjectWidget";
import type { Position, Size } from "@/types";
import type { ResizeData, ResizeType } from "./resize";
import ObjectControls from "./ObjectControls";

const Canvas = () => {
    const dispatch = useAppDispatch();
    const slide = useAppSelector(selectCurrentSlide);
    const elements = useAppSelector(selectCurrentSlideObjects);
    const selectedIds = useAppSelector(
        (state) => state.objects.objectSelection?.objects
    );
    const canvasRef = useRef<HTMLDivElement>(null);

    const [dragPositions, setDragPositions] = useState<Record<
        string,
        Position
    > | null>(null);

    const [dragPositionStart, setDragPositionStart] = useState<Position | null>(
        null
    );

    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

    const [resizeData, setResizeData] = useState<ResizeData | null>();

    if (!slide) return <h1>No slide</h1>;

    const getSelectedRect = (): { position: Position; rect: Size } | null => {
        const objects = elements.filter((e) =>
            (selectedIds ?? []).includes(e.id)
        );
        if (objects.length === 0) return null;

        const firstObj = objects[0];
        let minX = firstObj.position.x;
        let minY = firstObj.position.y;
        let maxX = firstObj.position.x + firstObj.rect.width;
        let maxY = firstObj.position.y + firstObj.rect.height;

        for (let i = 1; i < objects.length; i++) {
            const obj = objects[i];

            if (obj.position.x < minX) {
                minX = obj.position.x;
            }

            if (obj.position.y < minY) {
                minY = obj.position.y;
            }

            const objRight = obj.position.x + obj.rect.width;
            if (objRight > maxX) {
                maxX = objRight;
            }

            const objBottom = obj.position.y + obj.rect.height;
            if (objBottom > maxY) {
                maxY = objBottom;
            }
        }

        return {
            position: { x: minX, y: minY },
            rect: {
                width: maxX - minX,
                height: maxY - minY,
            },
        };
    };

    const getSelectedRectWithOffset = (): {
        position: Position;
        rect: Size;
    } => {
        const selectedRect = getSelectedRect()!;
        if (!dragPositions) return selectedRect;
        selectedRect.position.x += dragOffset.x;
        selectedRect.position.y += dragOffset.y;
        return selectedRect;
    };

    const pointInRect = (
        point: { x: number; y: number },
        rect: { position: Position; rect: Size }
    ): boolean => {
        if (point.x < rect.position.x || point.y < rect.position.y)
            return false;
        if (point.x > rect.position.x + rect.rect.width) return false;
        if (point.y > rect.position.y + rect.rect.height) return false;

        return true;
    };

    const calculateDraggedPositions = () => {
        if (!dragPositionStart) return;

        const objects = elements.filter((e) =>
            (selectedIds ?? []).includes(e.id)
        );

        const positions: Record<string, Position> = {};

        for (const obj of objects) {
            const newPos = { ...obj.position };
            newPos.x = obj.position.x + dragOffset.x;
            newPos.y = obj.position.y + dragOffset.y;
            positions[obj.id] = newPos;
        }

        setDragPositions(positions);
    };

    const getRelativePoint = (e: React.MouseEvent): Position => {
        if (!canvasRef) return { x: 0, y: 0 };
        const canvasRect = canvasRef.current!.getBoundingClientRect();

        const relativeX = e.clientX - canvasRect.left;
        const relativeY = e.clientY - canvasRect.top;
        return { x: relativeX, y: relativeY };
    };

    const onMouseDown = (e: React.MouseEvent) => {
        const selectedRect = getSelectedRect();
        const point = getRelativePoint(e);
        if (!selectedRect) return;
        if (!pointInRect(point, selectedRect)) return;

        setDragPositionStart(point);
    };

    const onResizeStart = (
        e: React.MouseEvent,
        type: ResizeType,
        elementId: string
    ) => {
        e.stopPropagation();
        setResizeData({
            id: elementId,
            position: elements.find((e) => e.id === elementId)!.position,
            size: elements.find((e) => e.id === elementId)!.rect,
            startPoint: getRelativePoint(e),
            startPos: elements.find((e) => e.id === elementId)!.position,
            startSize: elements.find((e) => e.id === elementId)!.rect,
            type: type,
        });
    };

    const onMouseMove = (e: React.MouseEvent) => {
        const point = getRelativePoint(e);

        if (resizeData) {
            const deltaX = point.x - resizeData.startPoint.x;
            const deltaY = point.y - resizeData.startPoint.y;

            const newPosition = { ...resizeData.startPos };
            const newSize = { ...resizeData.startSize };

            switch (resizeData.type) {
                case "nw": // top-left - двигаем левый верхний угол
                    newSize.width = Math.max(
                        10,
                        resizeData.startSize.width - deltaX
                    );
                    newSize.height = Math.max(
                        10,
                        resizeData.startSize.height - deltaY
                    );

                    newPosition.x =
                        resizeData.startPos.x +
                        (resizeData.startSize.width - newSize.width);
                    newPosition.y =
                        resizeData.startPos.y +
                        (resizeData.startSize.height - newSize.height);
                    break;

                case "ne": // top-right - двигаем правый верхний угол
                    newSize.width = Math.max(
                        10,
                        resizeData.startSize.width + deltaX
                    );
                    newSize.height = Math.max(
                        10,
                        resizeData.startSize.height - deltaY
                    );

                    newPosition.x = resizeData.startPos.x;
                    newPosition.y =
                        resizeData.startPos.y +
                        (resizeData.startSize.height - newSize.height);
                    break;

                case "sw": // bottom-left - двигаем левый нижний угол
                    newSize.width = Math.max(
                        10,
                        resizeData.startSize.width - deltaX
                    );
                    newSize.height = Math.max(
                        10,
                        resizeData.startSize.height + deltaY
                    );

                    newPosition.x =
                        resizeData.startPos.x +
                        (resizeData.startSize.width - newSize.width);
                    newPosition.y = resizeData.startPos.y;
                    break;

                case "se": // bottom-right - двигаем правый нижний угол
                    newSize.width = Math.max(
                        10,
                        resizeData.startSize.width + deltaX
                    );
                    newSize.height = Math.max(
                        10,
                        resizeData.startSize.height + deltaY
                    );
                    break;

                case "n": // top - двигаем верхнюю сторону
                    newSize.height = Math.max(
                        10,
                        resizeData.startSize.height - deltaY
                    );
                    newPosition.y =
                        resizeData.startPos.y +
                        (resizeData.startSize.height - newSize.height);
                    break;

                case "s": // bottom - двигаем нижнюю сторону
                    newSize.height = Math.max(
                        10,
                        resizeData.startSize.height + deltaY
                    );
                    break;

                case "w": // left - двигаем левую сторону
                    newSize.width = Math.max(
                        10,
                        resizeData.startSize.width - deltaX
                    );
                    newPosition.x =
                        resizeData.startPos.x +
                        (resizeData.startSize.width - newSize.width);
                    break;

                case "e": // right - двигаем правую сторону
                    newSize.width = Math.max(
                        10,
                        resizeData.startSize.width + deltaX
                    );
                    break;
            }

            newPosition.x = Math.max(0, newPosition.x);
            newPosition.y = Math.max(0, newPosition.y);

            setResizeData({
                ...resizeData,
                position: newPosition,
                size: newSize,
            });
        } else if (dragPositionStart) {
            setDragOffset({
                x: point.x - dragPositionStart.x,
                y: point.y - dragPositionStart.y,
            });

            calculateDraggedPositions();
        }
    };

    const onMouseUp = () => {
        if (dragPositions) {
            for (const id in dragPositions!) {
                const pos = dragPositions[id];
                dispatch(
                    moveObjectOnSlide({
                        slideId: slide!.id,
                        objectId: id,
                        newPosition: pos,
                    })
                );
            }
        }
        if (resizeData) {
            dispatch(
                resizeObjectOnSlide({
                    slideId: slide.id,
                    objectId: resizeData.id,
                    newPosition: resizeData.position,
                    newSize: resizeData.size,
                })
            );
            setResizeData(null);
        }
        setDragPositionStart(null);
        setDragPositions(null);
        setDragOffset({ x: 0, y: 0 });
    };

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
                    {(selectedIds?.length ?? 0) > 1 && (
                        <ObjectControls {...getSelectedRectWithOffset()} />
                    )}
                    {elements.map((element) => (
                        <SlideObjectWidget
                            element={element}
                            onMouseDown={onMouseDown}
                            onResizeStart={onResizeStart}
                            changedSize={
                                resizeData?.id === element.id
                                    ? resizeData.size
                                    : undefined
                            }
                            changedPosition={
                                resizeData?.id === element.id
                                    ? resizeData.position
                                    : dragPositions
                                      ? dragPositions[element.id]
                                      : undefined
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Canvas;
