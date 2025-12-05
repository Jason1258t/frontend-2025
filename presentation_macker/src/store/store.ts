import { configureStore } from "@reduxjs/toolkit";
import presentationReducer from "./slices/presentationSlice";
import slidesReducer from "./slices/slidesSlice";
import objectsReducer from "./slices/objectsSlice";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
    reducer: {
        presentation: presentationReducer,
        slides: slidesReducer,
        objects: objectsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;