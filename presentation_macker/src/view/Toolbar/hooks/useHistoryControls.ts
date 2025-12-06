import { useEffect } from "react";
import { useAppDispatch, useHistorySelector } from "@/store/store";
import { undo, redo } from "@/store/undoRedo";

export const useHistoryControls = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Проверка нажатия Ctrl (Windows) или Cmd (Mac)
            const isModifierPressed = event.ctrlKey || event.metaKey;

            if (!isModifierPressed) return;

            // Undo: Ctrl+Z / Cmd+Z
            if (event.code === "KeyZ" && !event.shiftKey) {
                event.preventDefault();
                dispatch(undo());
            }

            // Redo: Ctrl+Y / Cmd+Y
            if (event.code === "KeyY" || event.code === "KeyZ" && event.shiftKey) {
                event.preventDefault();
                dispatch(redo());
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [dispatch]);

    return {
        undo: () => dispatch(undo()),
        redo: () => dispatch(redo()),
        ...useHistorySelector(),
    };
};
