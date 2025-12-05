import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

interface PresentationState {
    id: string;
    title: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}

const initialPresentationState: PresentationState = {
    id: nanoid(),
    title: "Новая презентация",
    author: "Автор",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const presentationSlice = createSlice({
    name: "presentation",
    initialState: initialPresentationState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
            state.updatedAt = new Date().toISOString();
        },
    },
});

export const { setTitle } = presentationSlice.actions;
export default presentationSlice.reducer;
