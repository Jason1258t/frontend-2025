import React from "react";
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

    return (
        <>
            <div className={styles.field}>
                <label className={styles.label}>Размер шрифта</label>
                <input
                    type="number"
                    value={element.content.fontSize}
                    onChange={(e) =>
                        dispatch(
                            changeFontSize({
                                slideId,
                                objectId: element.id,
                                size: parseInt(e.target.value),
                            })
                        )
                    }
                    className={styles.input}
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Цвет</label>
                <input
                    type="color"
                    value={element.content.color}
                    onChange={(e) =>
                        dispatch(
                            changeObjectColor({
                                slideId,
                                objectId: element.id,
                                color: e.target.value,
                            })
                        )
                    }
                    className={`${styles.colorInput} ${styles.input}`}
                />
            </div>
        </>
    );
};

export default TextPropertiesPanel;