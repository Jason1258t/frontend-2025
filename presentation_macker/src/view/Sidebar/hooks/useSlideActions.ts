import { useCallback } from "react";
import type { Slide } from "@/types";

interface UseSlideActionsProps {
    slides: Slide[];
    selectedSlideIds: string[];
    onAddSlide: (slide: Slide) => void;
    onRemoveSlide: (slideId: string) => void;
    onClearSelection: () => void;
    generateNewSlide: () => Slide;
}

interface UseSlideActionsReturn {
    handleAddSlide: () => void;
    handleDeleteSlide: (slideId: string) => void;
    handleDeleteSelected: () => void;
    canDeleteSlide: (slideId: string) => boolean;
    canDeleteSelected: boolean;
}

export const useSlideActions = ({
    slides,
    selectedSlideIds,
    onAddSlide,
    onRemoveSlide,
    onClearSelection,
    generateNewSlide,
}: UseSlideActionsProps): UseSlideActionsReturn => {
    const handleAddSlide = useCallback(() => {
        const slide = generateNewSlide();
        onAddSlide(slide);
        onClearSelection();
    }, [generateNewSlide, onAddSlide, onClearSelection]);

    const handleDeleteSlide = useCallback(
        (slideId: string) => {
            if (selectedSlideIds.includes(slideId)) {
                onClearSelection();
            }
            onRemoveSlide(slideId);
        },
        [selectedSlideIds, onClearSelection, onRemoveSlide]
    );

    const handleDeleteSelected = useCallback(() => {
        if (selectedSlideIds.length === 0) return;

        selectedSlideIds.forEach((slideId) => {
            onRemoveSlide(slideId);
        });

        onClearSelection();
    }, [selectedSlideIds, onRemoveSlide, onClearSelection]);

    const canDeleteSlide = useCallback(
        (_: string) => {
            return slides.length > 1;
        },
        [slides.length]
    );

    const canDeleteSelected =
        selectedSlideIds.length > 0 &&
        selectedSlideIds.length !== slides.length;

    return {
        handleAddSlide,
        handleDeleteSlide,
        handleDeleteSelected,
        canDeleteSlide,
        canDeleteSelected,
    };
};
