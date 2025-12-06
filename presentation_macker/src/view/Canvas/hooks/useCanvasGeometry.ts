import { useCallback, useRef } from "react";
import type { Position, Size } from "@/types";

interface UseCanvasGeometryProps {
    elements: Array<{ id: string; position: Position; rect: Size }>;
    selectedIds: string[];
}

interface UseCanvasGeometryReturn {
    canvasRef: React.RefObject<HTMLDivElement | null>;
    getRelativePoint: (e: React.MouseEvent) => Position;
    getSelectedRect: () => { position: Position; rect: Size } | null;
    getSelectedRectWithOffset: (offset: Position) => {
        position: Position;
        rect: Size;
    };
    pointInRect: (
        point: Position,
        rect: { position: Position; rect: Size }
    ) => boolean;
}

export const useCanvasGeometry = ({
    elements,
    selectedIds,
}: UseCanvasGeometryProps): UseCanvasGeometryReturn => {
    const canvasRef = useRef<HTMLDivElement>(null);

    const getRelativePoint = useCallback((e: React.MouseEvent): Position => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const canvasRect = canvasRef.current.getBoundingClientRect();
        return {
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top,
        };
    }, []);

    const getSelectedRect = useCallback((): {
        position: Position;
        rect: Size;
    } | null => {
        const objects = elements.filter((e) => selectedIds.includes(e.id));
        if (objects.length === 0) return null;

        const firstObj = objects[0];
        let minX = firstObj.position.x;
        let minY = firstObj.position.y;
        let maxX = firstObj.position.x + firstObj.rect.width;
        let maxY = firstObj.position.y + firstObj.rect.height;

        for (let i = 1; i < objects.length; i++) {
            const obj = objects[i];
            minX = Math.min(minX, obj.position.x);
            minY = Math.min(minY, obj.position.y);
            maxX = Math.max(maxX, obj.position.x + obj.rect.width);
            maxY = Math.max(maxY, obj.position.y + obj.rect.height);
        }

        return {
            position: { x: minX, y: minY },
            rect: {
                width: maxX - minX,
                height: maxY - minY,
            },
        };
    }, [elements, selectedIds]);

    const getSelectedRectWithOffset = useCallback(
        (offset: Position): { position: Position; rect: Size } => {
            const selectedRect = getSelectedRect()!;
            return {
                position: {
                    x: selectedRect.position.x + offset.x,
                    y: selectedRect.position.y + offset.y,
                },
                rect: selectedRect.rect,
            };
        },
        [getSelectedRect]
    );

    const pointInRect = useCallback(
        (
            point: Position,
            rect: { position: Position; rect: Size }
        ): boolean => {
            return (
                point.x >= rect.position.x &&
                point.y >= rect.position.y &&
                point.x <= rect.position.x + rect.rect.width &&
                point.y <= rect.position.y + rect.rect.height
            );
        },
        []
    );

    return {
        canvasRef,
        getRelativePoint,
        getSelectedRect,
        getSelectedRectWithOffset,
        pointInRect,
    };
};
