import React, { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import styles from "../PropertiesPanel.module.css";
import type { TextObject } from "@/types";
import {
    changeFontSize,
    changeObjectColor,
    useAppDispatch,
    useAppSelector,
} from "@/store";

interface TextPropertiesPanelProps {
    element: TextObject;
}

export const TextPropertiesPanel: React.FC<TextPropertiesPanelProps> = ({
    element,
}) => {
    const dispatch = useAppDispatch();
    const slideId = useAppSelector((state) => state.slides.currentSlideId)!;
    const [localFontSize, setLocalFontSize] = useState(element.content.fontSize);
    const [localColor, setLocalColor] = useState(element.content.color);

    const debouncedChangeFontSize = useCallback(
        debounce((size: number) => {
            dispatch(
                changeFontSize({
                    slideId,
                    objectId: element.id,
                    size,
                })
            );
        }, 500), 
        [dispatch, slideId, element.id]
    );

    const debouncedChangeColor = useCallback(
        debounce((color: string) => {
            dispatch(
                changeObjectColor({
                    slideId,
                    objectId: element.id,
                    color,
                })
            );
        }, 300), 
        [dispatch, slideId, element.id]
    );

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setLocalFontSize(value);
        debouncedChangeFontSize(value);
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalColor(value);
        debouncedChangeColor(value);
    };


    useEffect(() => {
        return () => {
            debouncedChangeFontSize.cancel();
            debouncedChangeColor.cancel();
        };
    }, [debouncedChangeFontSize, debouncedChangeColor]);

    return (
        <>
            <div className={styles.field}>
                <label className={styles.label}>Размер шрифта</label>
                <input
                    type="number"
                    value={localFontSize}
                    onChange={handleFontSizeChange}
                    min="1"
                    max="200"
                    className={styles.input}
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Цвет</label>
                <div className={styles.colorContainer}>
                    <input
                        type="color"
                        value={localColor}
                        onChange={handleColorChange}
                        className={`${styles.colorInput} ${styles.input}`}
                        title="Выберите цвет"
                    />
                    <span 
                        className={styles.colorValue}
                        style={{ color: localColor }}
                    >
                        {localColor}
                    </span>
                </div>
            </div>
        </>
    );
};

export default TextPropertiesPanel;