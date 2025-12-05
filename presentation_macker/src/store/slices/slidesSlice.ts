import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Slide } from "@/types";
import { generateNewSlide } from "@/utils/defaultObjects";

interface SlidesState {
    slides: Slide[];
    currentSlideId: string | null;
    selectedSlideIds: string[];
}

const initSlide = generateNewSlide();

const initialSlidesState: SlidesState = {
    slides: [initSlide],
    currentSlideId: initSlide.id,
    selectedSlideIds: [],
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
        selectSlides: (
            state,
            action: PayloadAction<{ slideIds: string[]; clear: boolean }>
        ) => {
            const { slideIds, clear } = action.payload;

            if (clear) {
                state.selectedSlideIds = slideIds;
            } else {
                const newIds = slideIds.filter(
                    (id) => !state.selectedSlideIds.includes(id)
                );
                state.selectedSlideIds = [...state.selectedSlideIds, ...newIds];
            }
        },

        toggleSlideSelection: (state, action: PayloadAction<string>) => {
            const slideId = action.payload;
            const index = state.selectedSlideIds.indexOf(slideId);

            if (index === -1) {
                state.selectedSlideIds.push(slideId);
            } else {
                state.selectedSlideIds.splice(index, 1);
            }
        },

        clearSlideSelection: (state) => {
            state.selectedSlideIds = [];
        },

        moveSlidesInOrder: (
            state,
            action: PayloadAction<{ slideIds: string[]; targetIndex: number }>
        ) => {
            const { slideIds, targetIndex } = action.payload;

            const slidesToMove = state.slides.filter((s) =>
                slideIds.includes(s.id)
            );

            if (slidesToMove.length === 0) return;
            state.slides = state.slides.filter((s) => !slideIds.includes(s.id));

            state.slides.splice(targetIndex, 0, ...slidesToMove);
        },
    },
});

export const {
    addSlide,
    removeSlide,
    setCurrentSlide,
    moveSlide,
    changeSlideBackground,
    selectSlides,
    toggleSlideSelection,
    clearSlideSelection,
    moveSlidesInOrder,
} = slidesSlice.actions;
export default slidesSlice.reducer;
