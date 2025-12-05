import { useState, useCallback } from "react";

interface DragState {
  draggedSlideIds: string[];
  dragOverIndex: number | null;
}

interface UseSlideDragDropProps {
  slides: Array<{ id: string }>;
  selectedSlideIds: string[];
  onMoveSlides: (slideIds: string[], targetIndex: number) => void;
}

interface UseSlideDragDropReturn {
  dragState: DragState;
  handleDragStart: (e: React.DragEvent, slideId: string) => void;
  handleDragOver: (e: React.DragEvent, index: number) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, targetIndex: number) => void;
  handleDragEnd: () => void;
  isDragging: boolean;
  getDragOverPosition: (index: number) => "before" | "after" | null;
}

export const useSlideDragDrop = ({
  slides,
  selectedSlideIds,
  onMoveSlides,
}: UseSlideDragDropProps): UseSlideDragDropReturn => {
  const [dragState, setDragState] = useState<DragState>({
    draggedSlideIds: [],
    dragOverIndex: null,
  });

  const handleDragStart = useCallback(
    (e: React.DragEvent, slideId: string) => {
      const draggedIds = selectedSlideIds.includes(slideId)
        ? selectedSlideIds
        : [slideId];

      setDragState({
        draggedSlideIds: draggedIds,
        dragOverIndex: null,
      });

      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", draggedIds.join(","));
    },
    [selectedSlideIds]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      setDragState((prev) => ({
        ...prev,
        dragOverIndex: index,
      }));
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setDragState((prev) => ({
      ...prev,
      dragOverIndex: null,
    }));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();

      const { draggedSlideIds } = dragState;
      if (draggedSlideIds.length === 0) return;

      const draggedIndices = draggedSlideIds
        .map((id) => slides.findIndex((s) => s.id === id))
        .filter((idx) => idx !== -1)
        .sort((a, b) => a - b);

      const minDraggedIndex = Math.min(...draggedIndices);
      const maxDraggedIndex = Math.max(...draggedIndices);

      if (targetIndex > minDraggedIndex && targetIndex <= maxDraggedIndex + 1) {
        handleDragEnd();
        return;
      }

      let adjustedTargetIndex = targetIndex;
      
      if (targetIndex > maxDraggedIndex) {
        adjustedTargetIndex = targetIndex - draggedSlideIds.length;
      }

      onMoveSlides(draggedSlideIds, adjustedTargetIndex);
      handleDragEnd();
    },
    [dragState, slides, onMoveSlides]
  );

  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedSlideIds: [],
      dragOverIndex: null,
    });
  }, []);

  const getDragOverPosition = useCallback(
    (index: number): "before" | "after" | null => {
      if (dragState.dragOverIndex === null) return null;
      if (dragState.dragOverIndex === index) return "before";
      if (dragState.dragOverIndex === index + 1) return "after";
      return null;
    },
    [dragState.dragOverIndex]
  );

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    isDragging: dragState.draggedSlideIds.length > 0,
    getDragOverPosition,
  };
};