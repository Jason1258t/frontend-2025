import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectCurrentSlide = createSelector(
    (state: RootState) => state.slides.slides,
    (state: RootState) => state.slides.currentSlideId,
    (slides, currentSlideId) => {
        if (!currentSlideId) return null;
        return slides.find((slide) => slide.id === currentSlideId) || null;
    }
);

export const selectCurrentSlideObjects = createSelector(
    (state: RootState) => state.objects.objects,
    (state: RootState) => state.slides.currentSlideId,
    (objectsBySlide, currentSlideId) => {
        if (!currentSlideId) return [];
        return objectsBySlide[currentSlideId] || [];
    }
);

