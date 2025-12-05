import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Slide } from "../../types/slide";

interface SlidesState {
    slides: Slide[];
    currentSlideId: string | null;
}

const initialSlidesState: SlidesState = {
    slides: [],
    currentSlideId: null,
};

const slidesSlice = createSlice({
    name: "slides",
    initialState: initialSlidesState,
    reducers: {
        addSlide: (state, action: PayloadAction<Slide>) => {
            console.log("add slide", action.payload);
            state.slides.push(action.payload);
            if (!state.currentSlideId) state.currentSlideId = action.payload.id;
        },
        removeSlide: (state, action: PayloadAction<string>) => {
            const slideId = action.payload;
            state.slides = state.slides.filter((s) => s.id !== slideId);
            if (state.currentSlideId === slideId) {
                state.currentSlideId = state.slides[0]?.id || null;
            }
        },
        setCurrentSlide: (state, action: PayloadAction<string>) => {
            if (state.slides.some((s) => s.id === action.payload)) {
                state.currentSlideId = action.payload;
            }
        },
        moveSlide: (
            state,
            action: PayloadAction<{ slideId: string; toIndex: number }>
        ) => {
            const { slideId, toIndex } = action.payload;
            const fromIndex = state.slides.findIndex((s) => s.id === slideId);
            if (fromIndex === -1) return;

            const [slide] = state.slides.splice(fromIndex, 1);
            state.slides.splice(toIndex, 0, slide);
        },
        changeSlideBackground: (
            state,
            action: PayloadAction<{
                slideId: string;
                background: { color: string; backgroundImage: string | null };
            }>
        ) => {
            const { slideId, background } = action.payload;
            const slide = state.slides.find((s) => s.id === slideId);
            if (slide) {
                slide.theme = { ...slide.theme, ...background };
            }
        },
    },
});

export const {
    addSlide,
    removeSlide,
    setCurrentSlide,
    moveSlide,
    changeSlideBackground,
} = slidesSlice.actions;
export default slidesSlice.reducer;
