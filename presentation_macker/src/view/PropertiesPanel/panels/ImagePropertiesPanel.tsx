import React from "react";
import styles from "../PropertiesPanel.module.css";
import type { ImageObject } from "@/types";
import {
    changeImageSRC,
    useAppDispatch,
    useAppSelector,
} from "@/store";

interface ImagePropertiesPanelProps {
    element: ImageObject;
}

export const ImagePropertiesPanel: React.FC<ImagePropertiesPanelProps> = ({
    element,
}) => {
    const dispatch = useAppDispatch();
    const slideId = useAppSelector((state) => state.slides.currentSlideId)!;

    return (
        <>
            <div className={styles.field}>
                <label className={styles.label}>SRC</label>
                <input
                    type="text"
                    value={element.content.src}
                    onChange={(e) =>
                        dispatch(
                            changeImageSRC({
                                slideId,
                                objectId: element.id,
                                src: e.target.value,
                            })
                        )
                    }
                    className={styles.input}
                />
            </div>
        </>
    );
};

export default ImagePropertiesPanel;
