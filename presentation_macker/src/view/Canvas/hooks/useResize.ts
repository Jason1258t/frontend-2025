import { useState, useCallback } from "react";
import type { Position, Size } from "@/types";

type ResizeType = "nw" | "ne" | "sw" | "se" | "n" | "s" | "w" | "e";

interface ResizeData {
    startSize: any;
    id: string;
    position: Position;
    size: Size;
    startPoint: Position;
    startPos: Position;
    type: ResizeType;
}

export { type ResizeData, type ResizeType };

interface UseResizeProps {
    elements: Array<{ id: string; position: Position; rect: Size }>;
}

interface UseResizeReturn {
    resizeData: ResizeData | null;
    isResizing: boolean;
    handleResizeStart: (elementId: string, type: ResizeType, startPoint: Position) => void;
    handleResizeMove: (point: Position) => void;
    handleResizeEnd: () => ResizeData | null;
}

export const useResize = ({ elements }: UseResizeProps): UseResizeReturn => {
    const [resizeData, setResizeData] = useState<ResizeData | null>(null);

    const handleResizeStart = useCallback(
        (elementId: string, type: ResizeType, startPoint: Position) => {
            const element = elements.find((e) => e.id === elementId);
            if (!element) return;

            setResizeData({
                id: elementId,
                position: element.position,
                size: element.rect,
                startPoint: startPoint,
                startPos: element.position,
                startSize: element.rect,
                type: type,
            });
        },
        [elements]
    );

    const calculateNewSizeAndPosition = useCallback(
        (point: Position, resizeData: ResizeData): { position: Position; size: Size } => {
            const deltaX = point.x - resizeData.startPoint.x;
            const deltaY = point.y - resizeData.startPoint.y;

            const newPosition = { ...resizeData.startPos };
            const newSize = { ...resizeData.startSize };

            switch (resizeData.type) {
                case "nw": // top-left
                    newSize.width = Math.max(10, resizeData.startSize.width - deltaX);
                    newSize.height = Math.max(10, resizeData.startSize.height - deltaY);
                    newPosition.x = resizeData.startPos.x + (resizeData.startSize.width - newSize.width);
                    newPosition.y = resizeData.startPos.y + (resizeData.startSize.height - newSize.height);
                    break;

                case "ne": // top-right
                    newSize.width = Math.max(10, resizeData.startSize.width + deltaX);
                    newSize.height = Math.max(10, resizeData.startSize.height - deltaY);
                    newPosition.x = resizeData.startPos.x;
                    newPosition.y = resizeData.startPos.y + (resizeData.startSize.height - newSize.height);
                    break;

                case "sw": // bottom-left
                    newSize.width = Math.max(10, resizeData.startSize.width - deltaX);
                    newSize.height = Math.max(10, resizeData.startSize.height + deltaY);
                    newPosition.x = resizeData.startPos.x + (resizeData.startSize.width - newSize.width);
                    newPosition.y = resizeData.startPos.y;
                    break;

                case "se": // bottom-right
                    newSize.width = Math.max(10, resizeData.startSize.width + deltaX);
                    newSize.height = Math.max(10, resizeData.startSize.height + deltaY);
                    break;

                case "n": // top
                    newSize.height = Math.max(10, resizeData.startSize.height - deltaY);
                    newPosition.y = resizeData.startPos.y + (resizeData.startSize.height - newSize.height);
                    break;

                case "s": // bottom
                    newSize.height = Math.max(10, resizeData.startSize.height + deltaY);
                    break;

                case "w": // left
                    newSize.width = Math.max(10, resizeData.startSize.width - deltaX);
                    newPosition.x = resizeData.startPos.x + (resizeData.startSize.width - newSize.width);
                    break;

                case "e": // right
                    newSize.width = Math.max(10, resizeData.startSize.width + deltaX);
                    break;
            }

            newPosition.x = Math.max(0, newPosition.x);
            newPosition.y = Math.max(0, newPosition.y);

            return { position: newPosition, size: newSize };
        },
        []
    );

    const handleResizeMove = useCallback(
        (point: Position) => {
            if (!resizeData) return;

            const { position, size } = calculateNewSizeAndPosition(point, resizeData);
            setResizeData({
                ...resizeData,
                position,
                size,
            });
        },
        [resizeData, calculateNewSizeAndPosition]
    );

    const handleResizeEnd = useCallback(() => {
        const result = resizeData;
        setResizeData(null);
        return result;
    }, [resizeData]);

    return {
        resizeData,
        isResizing: resizeData !== null,
        handleResizeStart,
        handleResizeMove,
        handleResizeEnd,
    };
};