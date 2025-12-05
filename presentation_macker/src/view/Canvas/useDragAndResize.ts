import { useState, useCallback } from "react";
import type { Position, Size } from "@/types";

type ResizeHandle = 
  | "top-left" 
  | "top-center" 
  | "top-right"
  | "middle-left"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface DragState {
  startPosition: Position;
  initialPositions: Record<string, Position>;
}

interface ResizeState {
  startPosition: Position;
  initialRect: { position: Position; size: Size };
  handle: ResizeHandle;
}

interface UseDragAndResizeProps {
  selectedIds: string[];
  elements: Array<{ id: string; position: Position; rect: Size }>;
  onDragComplete: (positions: Record<string, Position>) => void;
  onResizeComplete: (elementId: string, position: Position, size: Size) => void;
}

interface UseDragAndResizeReturn {
  dragPositions: Record<string, Position> | null;
  resizeState: { position: Position; size: Size } | null;
  resizingElementId: string | null;
  handleMouseDown: (e: React.MouseEvent, elementId?: string) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleResizeStart: (e: React.MouseEvent, elementId: string, handle: ResizeHandle) => void;
  getRelativePoint: (e: React.MouseEvent, canvasRef: React.RefObject<HTMLDivElement>) => Position;
}

export const useDragAndResize = ({
  selectedIds,
  elements,
  onDragComplete,
  onResizeComplete,
}: UseDragAndResizeProps): UseDragAndResizeReturn => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragPositions, setDragPositions] = useState<Record<string, Position> | null>(null);
  
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [resizeResult, setResizeResult] = useState<{ position: Position; size: Size } | null>(null);
  const [resizingElementId, setResizingElementId] = useState<string | null>(null);

  const getRelativePoint = useCallback(
    (e: React.MouseEvent, canvasRef: React.RefObject<HTMLDivElement>): Position => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const canvasRect = canvasRef.current.getBoundingClientRect();
      return {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      };
    },
    []
  );

  const getSelectedRect = useCallback((): { position: Position; rect: Size } | null => {
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
      rect: { width: maxX - minX, height: maxY - minY },
    };
  }, [elements, selectedIds]);

  const pointInRect = useCallback(
    (point: Position, rect: { position: Position; rect: Size }): boolean => {
      return (
        point.x >= rect.position.x &&
        point.y >= rect.position.y &&
        point.x <= rect.position.x + rect.rect.width &&
        point.y <= rect.position.y + rect.rect.height
      );
    },
    []
  );

  const calculateDragPositions = useCallback(
    (currentPosition: Position, dragState: DragState) => {
      const delta = {
        x: currentPosition.x - dragState.startPosition.x,
        y: currentPosition.y - dragState.startPosition.y,
      };

      const positions: Record<string, Position> = {};
      for (const id in dragState.initialPositions) {
        const initial = dragState.initialPositions[id];
        positions[id] = {
          x: initial.x + delta.x,
          y: initial.y + delta.y,
        };
      }

      return positions;
    },
    []
  );

  const calculateResize = useCallback(
    (currentPosition: Position, resizeState: ResizeState): { position: Position; size: Size } => {
      const delta = {
        x: currentPosition.x - resizeState.startPosition.x,
        y: currentPosition.y - resizeState.startPosition.y,
      };

      const { position: initialPos, size: initialSize } = resizeState.initialRect;
      let newPos = { ...initialPos };
      let newSize = { ...initialSize };

      const handle = resizeState.handle;

      // Обработка изменения по вертикали
      if (handle.includes("top")) {
        newPos.y = initialPos.y + delta.y;
        newSize.height = initialSize.height - delta.y;
      } else if (handle.includes("bottom")) {
        newSize.height = initialSize.height + delta.y;
      }

      // Обработка изменения по горизонтали
      if (handle.includes("left")) {
        newPos.x = initialPos.x + delta.x;
        newSize.width = initialSize.width - delta.x;
      } else if (handle.includes("right")) {
        newSize.width = initialSize.width + delta.x;
      }

      // Минимальные размеры
      const MIN_SIZE = 20;
      if (newSize.width < MIN_SIZE) {
        if (handle.includes("left")) {
          newPos.x = initialPos.x + initialSize.width - MIN_SIZE;
        }
        newSize.width = MIN_SIZE;
      }
      if (newSize.height < MIN_SIZE) {
        if (handle.includes("top")) {
          newPos.y = initialPos.y + initialSize.height - MIN_SIZE;
        }
        newSize.height = MIN_SIZE;
      }

      return { position: newPos, size: newSize };
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (resizeState) return; // Не начинаем drag во время resize

      const canvasRef = { current: e.currentTarget as HTMLDivElement };
      const point = getRelativePoint(e, canvasRef);
      const selectedRect = getSelectedRect();

      if (!selectedRect || !pointInRect(point, selectedRect)) return;

      const initialPositions: Record<string, Position> = {};
      elements
        .filter((el) => selectedIds.includes(el.id))
        .forEach((el) => {
          initialPositions[el.id] = { ...el.position };
        });

      setDragState({
        startPosition: point,
        initialPositions,
      });
    },
    [elements, selectedIds, getRelativePoint, getSelectedRect, pointInRect, resizeState]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, elementId: string, handle: ResizeHandle) => {
      e.stopPropagation();
      
      const element = elements.find((el) => el.id === elementId);
      if (!element) return;

      const canvasRef = { current: e.currentTarget.closest('[class*="canvas"]') as HTMLDivElement };
      const point = getRelativePoint(e, canvasRef);

      setResizeState({
        startPosition: point,
        initialRect: {
          position: { ...element.position },
          size: { ...element.rect },
        },
        handle,
      });
      setResizingElementId(elementId);
    },
    [elements, getRelativePoint]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvasRef = { current: e.currentTarget as HTMLDivElement };
      const point = getRelativePoint(e, canvasRef);

      if (dragState) {
        const positions = calculateDragPositions(point, dragState);
        setDragPositions(positions);
      } else if (resizeState) {
        const result = calculateResize(point, resizeState);
        setResizeResult(result);
      }
    },
    [dragState, resizeState, getRelativePoint, calculateDragPositions, calculateResize]
  );

  const handleMouseUp = useCallback(() => {
    if (dragState && dragPositions) {
      onDragComplete(dragPositions);
      setDragState(null);
      setDragPositions(null);
    } else if (resizeState && resizeResult && resizingElementId) {
      onResizeComplete(resizingElementId, resizeResult.position, resizeResult.size);
      setResizeState(null);
      setResizeResult(null);
      setResizingElementId(null);
    }
  }, [dragState, dragPositions, resizeState, resizeResult, resizingElementId, onDragComplete, onResizeComplete]);

  return {
    dragPositions,
    resizeState: resizeResult,
    resizingElementId,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleResizeStart,
    getRelativePoint,
  };
};