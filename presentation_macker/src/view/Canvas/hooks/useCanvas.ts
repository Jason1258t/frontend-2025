import { useCallback } from "react";

import { useCanvasGeometry, useDrag, useResize, type ResizeType } from "./index";

export const useCanvas = (
    elements: any[],
    selectedIds: string[]
) => {
    const canvasGeometry = useCanvasGeometry({ elements, selectedIds });
    const drag = useDrag({
        selectedIds,
        elements,
        getSelectedRect: canvasGeometry.getSelectedRect,
        pointInRect: canvasGeometry.pointInRect,
    });
    const resize = useResize({ elements });

    const handleDragStart = useCallback(
        (e: React.MouseEvent) => {
            const point = canvasGeometry.getRelativePoint(e);
            drag.handleDragStart(point);
        },
        [canvasGeometry, drag]
    );

    const handleResizeStart = useCallback(
        (e: React.MouseEvent, type: ResizeType, elementId: string) => {
            e.stopPropagation();
            const point = canvasGeometry.getRelativePoint(e);
            resize.handleResizeStart(elementId, type, point);
        },
        [canvasGeometry, resize]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            const point = canvasGeometry.getRelativePoint(e);

            if (resize.isResizing) {
                resize.handleResizeMove(point);
            } else if (drag.isDragging) {
                drag.handleDragMove(point);
            }
        },
        [canvasGeometry, resize, drag]
    );

    const handleMouseUp = useCallback(() => {
        return {
            dragResult: drag.handleDragEnd(),
            resizeResult: resize.handleResizeEnd(),
        };
    }, [drag, resize]);

    return {
        canvasRef: canvasGeometry.canvasRef,
        canvasGeometry,
        drag,
        resize,
        handleDragStart,
        handleResizeStart,
        handleMouseMove,
        handleMouseUp,
        getSelectedRectWithOffset: canvasGeometry.getSelectedRectWithOffset,
    };
};