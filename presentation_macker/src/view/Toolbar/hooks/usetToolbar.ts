import {
    useAppDispatch,
    useAppSelector,
    selectCurrentSlide,
    selectCurrentSlideObjects,
    removeObjectFromSlide,
    selectElements,
    addObjectToSlide,
} from "@/store";
import {
    createDefaultTextObject,
    createDefaultImageObject,
} from "@/utils/defaultObjects";
import { getZIndexForNewObject } from "@/utils/getZIndexForObject";
import { useEffect, useState } from "react";
import { useHistoryControls } from "./useHistoryControls";

export const useToolbar = () => {
    const dispatch = useAppDispatch();
    const currentSlide = useAppSelector(selectCurrentSlide);
    const selectedObjectsIds =
        useAppSelector((state) => state.objects.objectSelection?.objects) ?? [];
    const selectedObjects = useAppSelector(selectCurrentSlideObjects);

    const deleteSelectedObjects = () => {
        if (!currentSlide) return;
        for (const el of selectedObjectsIds) {
            dispatch(
                removeObjectFromSlide({
                    slideId: currentSlide.id,
                    objectId: el,
                })
            );
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "Escape" &&
                currentSlide &&
                selectedObjectsIds.length > 0
            ) {
                e.preventDefault();
                dispatch(
                    selectElements({
                        slideId: currentSlide.id,
                        objectIds: [],
                        clear: true,
                    })
                );
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedObjects, currentSlide, selectedObjectsIds]);

    const onAddText = () => {
        const newText = createDefaultTextObject(
            getZIndexForNewObject(selectedObjects)
        );
        dispatch(
            addObjectToSlide({ slideId: currentSlide!.id, object: newText })
        );
    };

    const onAddImage = () => {
        const newImage = createDefaultImageObject(
            getZIndexForNewObject(selectedObjects)
        );
        dispatch(
            addObjectToSlide({ slideId: currentSlide!.id, object: newImage })
        );
    };

    const [showOverlay, setShowOverlay] = useState(false);

    const onChangeBackground = () => {
        setShowOverlay(true);
    };

    return {
        showOverlay,
        onChangeBackground,
        onAddImage,
        onAddText,
        deleteSelectedObjects,
        openOverlay: () => setShowOverlay(true),
        closeOverlay: () => setShowOverlay(false),
        ...useHistoryControls(),
        showSlideAction: currentSlide,
        showDeleteAction: selectedObjectsIds && currentSlide,
    };
};
