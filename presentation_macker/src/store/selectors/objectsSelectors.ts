import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectEditingElement = createSelector(
    (state: RootState) => state.objects.objectSelection,
    (state: RootState) => state.slides.currentSlideId,
    (state: RootState) => state.objects.objects,
    (selection, slideId, objects) => {
        if (!slideId) return;
        if (!selection) return;
        return objects[slideId]?.find((e) => e.id === selection.objects[0]);
    }
);
