import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SlideObject, Text } from "../../types/slide-content";
import type { ObjectSelection } from "@/types";
import { generateId } from "@/utils/generateId";

interface ObjectsState {
    objectSelection: ObjectSelection | null;
    objects: Record<string, SlideObject[]>;
}

const initialObjectsState: ObjectsState = {
    objectSelection: null,
    objects: {},
};

const updateTextObject = (
    state: ObjectsState,
    slideId: string,
    objectId: string,
    update: Partial<Text>
) => {
    const slideObjects = state.objects[slideId];
    if (!slideObjects) return false;

    const obj = slideObjects.find((o) => o.id === objectId);
    if (!obj || obj.type !== "text") return false;

    obj.content = { ...obj.content, ...update };

    return true;
};

const objectsSlice = createSlice({
    name: "objects",
    initialState: initialObjectsState,
    reducers: {
        addObjectToSlide: (
            state,
            action: PayloadAction<{ slideId: string; object: SlideObject }>
        ) => {
            const { slideId, object } = action.payload;
            console.log("add object to slide", slideId, object);
            if (!state.objects[slideId]) {
                state.objects[slideId] = [];
            }

            state.objects[slideId].push(object);
            state.objectSelection = { id: generateId(), objects: [object.id] };
        },
        removeObjectFromSlide: (
            state,
            action: PayloadAction<{ slideId: string; objectId: string }>
        ) => {
            const { slideId, objectId } = action.payload;

            if (!state.objects[slideId]) return;

            state.objects[slideId] = state.objects[slideId].filter(
                (e) => e.id != objectId
            );
        },
        moveObjectOnSlide: (
            state,
            action: PayloadAction<{
                slideId: string;
                objectId: string;
                newPosition: { x: number; y: number };
            }>
        ) => {
            const { slideId, objectId, newPosition } = action.payload;

            if (!state.objects[slideId]) return;

            const ind = state.objects[slideId].findIndex(
                (e) => e.id === objectId
            );

            if (ind === -1) return;

            state.objects[slideId][ind].position = newPosition;
        },
        resizeObjectOnSlide: (
            state,
            action: PayloadAction<{
                slideId: string;
                objectId: string;
                newPosition: { x: number; y: number };
                newSize: { width: number; height: number };
            }>
        ) => {
            const { slideId, objectId, newPosition, newSize } = action.payload;

            if (!state.objects[slideId]) return;

            const ind = state.objects[slideId].findIndex(
                (e) => e.id === objectId
            );

            if (ind === -1) return;

            state.objects[slideId][ind].position = newPosition;
            state.objects[slideId][ind].rect = newSize;
        },
        changeFontSize: (
            state,
            action: PayloadAction<{
                slideId: string;
                objectId: string;
                size: number;
            }>
        ) => {
            const { slideId, objectId, size } = action.payload;
            updateTextObject(state, slideId, objectId, { fontSize: size });
        },

        changeFontFamily: (state, action) => {
            const { slideId, objectId, fontFamily } = action.payload;
            updateTextObject(state, slideId, objectId, { fontFamily });
        },

        changeTextValue: (
            state,
            action: PayloadAction<{
                slideId: string;
                objectId: string;
                newValue: string;
            }>
        ) => {
            const { slideId, objectId, newValue } = action.payload;
            updateTextObject(state, slideId, objectId, { value: newValue });
        },

        changeObjectColor: (
            state,
            action: PayloadAction<{
                slideId: string;
                objectId: string;
                color: string;
            }>
        ) => {
            const { slideId, objectId, color } = action.payload;
            updateTextObject(state, slideId, objectId, { color: color });
        },
        selectElements: (
            state,
            action: PayloadAction<{
                slideId: string;
                objectIds: string[];
                clear: boolean;
            }>
        ) => {
            if (action.payload.clear || !state.objectSelection) {
                state.objectSelection = {
                    id: generateId(),
                    objects: action.payload.objectIds,
                };
            } else {
                state.objectSelection.objects = [
                    ...state.objectSelection.objects,
                    ...action.payload.objectIds,
                ];
            }
        },
        changeImageSRC: (
            state,
            action: PayloadAction<{
                slideId: string;
                objectId: string;
                src: string;
            }>
        ) => {
            const { slideId, objectId, src } = action.payload;

            const obj = state.objects[slideId].find((e) => e.id === objectId);
            if (obj?.type !== "image") return;
            obj.content.src = src;
        },
        clearObjectSelection: (state) => {
            state.objectSelection = { id: generateId(), objects: [] };
        },
    },
});

export const {
    clearObjectSelection,
    removeObjectFromSlide,
    addObjectToSlide,
    selectElements,
    changeTextValue,
    changeFontSize,
    changeFontFamily,
    moveObjectOnSlide,
    changeObjectColor,
    changeImageSRC,
    resizeObjectOnSlide,
} = objectsSlice.actions;
export default objectsSlice.reducer;
