import { changeTextValue, useAppDispatch, useAppSelector } from "@/store";
import type { Text } from "@/types";
import React from "react";
import styles from '../Canvas.module.css';

interface TextContentProps {
    content: Text;
    elementId: string;
}

export const TextContent: React.FC<TextContentProps> = ({ content, elementId }) => {
    const dispatch = useAppDispatch();
    const slideId = useAppSelector(state => state.slides.currentSlideId)!;

    return (
        <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
                dispatch(
                    changeTextValue({
                        slideId: slideId,
                        objectId: elementId,
                        newValue: e.currentTarget.textContent || "",
                    })
                )
            }
            className={styles.textElement}
            style={{
                fontSize: content.fontSize,
                color: content.color,
                fontFamily: content.fontFamily,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {content.value}
        </div>
    );
};
