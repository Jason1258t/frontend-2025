import { 
    createAction, 
    type Reducer, 
    type UnknownAction 
} from "@reduxjs/toolkit";

export const undo = createAction("history/undo");
export const redo = createAction("history/redo");

interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

export function withUndoRedo<T>(
    reducer: Reducer<T, UnknownAction>,
    ignoredActionTypes: string[] = []
): Reducer<HistoryState<T>, UnknownAction> {
    
    const initialState: HistoryState<T> = {
        past: [],
        present: reducer(undefined, { type: "@@INIT" }) as T,
        future: [],
    };

    return (state = initialState, action: UnknownAction): HistoryState<T> => {
        const { past, present, future } = state;

        if (undo.match(action)) {
            if (past.length === 0) return state;
            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);
            return {
                past: newPast,
                present: previous,
                future: [present, ...future],
            };
        }

        if (redo.match(action)) {
            if (future.length === 0) return state;
            const next = future[0];
            const newFuture = future.slice(1);
            return {
                past: [...past, present],
                present: next,
                future: newFuture,
            };
        }

        const newPresent = reducer(present, action);

        if (present === newPresent) {
            return state;
        }

        if (ignoredActionTypes.includes(action.type)) {
            return {
                past,
                present: newPresent,
                future,
            };
        }

        return {
            past: [...past, present],
            present: newPresent,
            future: [], 
        };
    };
}