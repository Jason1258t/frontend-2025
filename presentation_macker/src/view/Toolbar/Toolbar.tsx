import { Type, ImageIcon, Trash2, Palette } from "lucide-react";
import { useState } from "react";

import styles from "./Toolbar.module.css";
import ThemeOverlay from "./ThemeOverlay";
import {
    selectCurrentSlide,
    selectCurrentSlideObjects,
} from "@/store/selectors/slideSelectors";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
    addObjectToSlide,
    removeObjectFromSlide,
} from "@/store/slices/objectsSlice";
import {
    createDefaultImageObject,
    createDefaultTextObject,
} from "@/utils/defaultObjects";
import { getZIndexForNewObject } from "@/utils/getZIndexForObject";

const Toolbar = () => {
    const dispatch = useAppDispatch();
    const currentSlide = useAppSelector(selectCurrentSlide);
    const selectedObjectsIds =
        useAppSelector((state) => state.objects.objectSelection?.objects) ?? [];
    const selectedObjects = useAppSelector(selectCurrentSlideObjects);

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
    return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarContent}>
                {currentSlide && (
                    <>
                        {" "}
                        <button
                            onClick={onAddText}
                            className={styles.toolButton}
                        >
                            <Type size={20} />
                            Текст
                        </button>
                        <button
                            onClick={onAddImage}
                            className={styles.toolButton}
                        >
                            <ImageIcon size={20} />
                            Изображение
                        </button>
                        <button
                            onClick={onChangeBackground}
                            className={styles.toolButton}
                        >
                            <Palette size={20} />
                            Сменить фон
                        </button>
                    </>
                )}
                {selectedObjectsIds && currentSlide && (
                    <button
                        onClick={() => {
                            for (const el of selectedObjectsIds) {
                                dispatch(
                                    removeObjectFromSlide({
                                        slideId: currentSlide.id,
                                        objectId: el,
                                    })
                                );
                            }
                        }}
                        className={`${styles.toolButton} ${styles.deleteButton}`}
                    >
                        <Trash2 size={20} />
                        Удалить элемент
                    </button>
                )}
            </div>
            {showOverlay && (
                <ThemeOverlay onClose={() => setShowOverlay(false)} />
            )}
        </div>
    );
};

export default Toolbar;
