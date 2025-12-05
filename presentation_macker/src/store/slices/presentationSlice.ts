import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

interface PresentationState {
  id: string;
  title: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const initialPresentationState: PresentationState = {
  id: nanoid(),
  title: "Новая презентация",
  author: "Автор",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const presentationSlice = createSlice({
  name: "presentation",
  initialState: initialPresentationState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      state.updatedAt = new Date();
    },
  },
});

export const { setTitle } = presentationSlice.actions;
export default presentationSlice.reducer;