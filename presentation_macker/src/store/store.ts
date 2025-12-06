import { combineReducers, configureStore } from "@reduxjs/toolkit";
import presentationReducer from "./slices/presentationSlice";
import slidesReducer, {
    selectSlides,
    toggleSlideSelection,
    clearSlideSelection,
} from "./slices/slidesSlice";
import objectsReducer, {
    selectElements,
    clearObjectSelection,
} from "./slices/objectsSlice";
import {
    useDispatch,
    useSelector,
    type TypedUseSelectorHook,
} from "react-redux";
import { withUndoRedo } from "./undoRedo";

const rootReducer = combineReducers({
    presentation: presentationReducer,
    slides: slidesReducer,
    objects: objectsReducer,
});

// Список экшенов, которые НЕ должны вызывать запись в историю
// (В основном это действия выделения/селекции)
const IGNORED_ACTIONS = [
    selectSlides.type,
    toggleSlideSelection.type,
    clearSlideSelection.type,
    selectElements.type,
    clearObjectSelection.type,
];

const undoableRootReducer = withUndoRedo(rootReducer, IGNORED_ACTIONS);

export const store = configureStore({
    reducer: undoableRootReducer,
});

export type StoreState = ReturnType<typeof undoableRootReducer>;
export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = (selector) => {
    return useSelector((state: StoreState) => selector(state.present));
};

export const useHistorySelector = () => {
    return useSelector((state: StoreState) => ({
        canUndo: state.past.length > 0,
        canRedo: state.future.length > 0,
    }));
};
