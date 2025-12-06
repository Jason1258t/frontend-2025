import { useCallback } from "react";
import type { Slide } from "@/types";

interface UseSlideSelectionProps {
    slides: Slide[];
    currentSlideId: string | null;
    selectedSlideIds: string[];
    onToggleSelection: (slideId: string) => void;
    onSelectSlides: (slideIds: string[], clear: boolean) => void;
    onClearSelection: () => void;
    onSetCurrentSlide: (slideId: string) => void;
}

interface UseSlideSelectionReturn {
    handleSelectSlide: (e: React.MouseEvent, slideId: string) => void;
}

export const useSlideSelection = ({
    slides,
    currentSlideId,
    selectedSlideIds,
    onToggleSelection,
    onSelectSlides,
    onClearSelection,
    onSetCurrentSlide,
}: UseSlideSelectionProps): UseSlideSelectionReturn => {
    const handleSelectSlide = useCallback(
        (e: React.MouseEvent, slideId: string) => {
            e.stopPropagation();

            if (e.ctrlKey || e.metaKey) {
                // Ctrl/Cmd + клик = добавить/убрать из выделения
                onToggleSelection(slideId);
            } else if (e.shiftKey) {
                // Shift + клик = выделить диапазон
                const currentIndex = slides.findIndex(
                    (s) => s.id === currentSlideId
                );
                const targetIndex = slides.findIndex((s) => s.id === slideId);

                if (currentIndex !== -1) {
                    const start = Math.min(currentIndex, targetIndex);
                    const end = Math.max(currentIndex, targetIndex);
                    const slideIds = slides
                        .slice(start, end + 1)
                        .map((s) => s.id);

                    const newIds = slideIds.filter(
                        (id) => !selectedSlideIds.includes(id)
                    );
                    if (newIds.length > 0) {
                        onSelectSlides(newIds, false);
                    }
                }
            } else {
                // Обычный клик = выделить только этот слайд
                onClearSelection();
                onSetCurrentSlide(slideId);
            }
        },
        [
            slides,
            currentSlideId,
            selectedSlideIds,
            onToggleSelection,
            onSelectSlides,
            onClearSelection,
            onSetCurrentSlide,
        ]
    );

    return {
        handleSelectSlide,
    };
};
