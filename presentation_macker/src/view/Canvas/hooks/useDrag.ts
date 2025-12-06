import { useState, useCallback } from "react";
import type { Position } from "@/types";

interface UseDragProps {
    selectedIds: string[];
    elements: Array<{ id: string; position: Position }>;
    getSelectedRect: () => { position: Position; rect: { width: number; height: number } } | null;
    pointInRect: (point: Position, rect: { position: Position; rect: { width: number; height: number } }) => boolean;
}

interface UseDragReturn {
    dragPositions: Record<string, Position> | null;
    dragOffset: Position;
    isDragging: boolean;
    handleDragStart: (point: Position) => void;
    handleDragMove: (point: Position) => void;
    handleDragEnd: () => Record<string, Position> | null;
}

export const useDrag = ({
    selectedIds,
    elements,
    getSelectedRect,
    pointInRect,
}: UseDragProps): UseDragReturn => {
    const [dragPositionStart, setDragPositionStart] = useState<Position | null>(null);
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
    const [dragPositions, setDragPositions] = useState<Record<string, Position> | null>(null);

    const handleDragStart = useCallback(
        (point: Position) => {
            const selectedRect = getSelectedRect();
            if (!selectedRect) return;
            if (!pointInRect(point, selectedRect)) return;

            setDragPositionStart(point);
        },
        [getSelectedRect, pointInRect]
    );

    const calculateDraggedPositions = useCallback(
        (offset: Position) => {
            const objects = elements.filter((e) => selectedIds.includes(e.id));
            const positions: Record<string, Position> = {};

            for (const obj of objects) {
                positions[obj.id] = {
                    x: obj.position.x + offset.x,
                    y: obj.position.y + offset.y,
                };
            }

            return positions;
        },
        [elements, selectedIds]
    );

    const handleDragMove = useCallback(
        (point: Position) => {
            if (!dragPositionStart) return;

            const offset = {
                x: point.x - dragPositionStart.x,
                y: point.y - dragPositionStart.y,
            };

            setDragOffset(offset);
            setDragPositions(calculateDraggedPositions(offset));
        },
        [dragPositionStart, calculateDraggedPositions]
    );

    const handleDragEnd = useCallback(() => {
        const result = dragPositions;
        setDragPositionStart(null);
        setDragPositions(null);
        setDragOffset({ x: 0, y: 0 });
        return result;
    }, [dragPositions]);

    return {
        dragPositions,
        dragOffset,
        isDragging: dragPositionStart !== null,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
    };
};