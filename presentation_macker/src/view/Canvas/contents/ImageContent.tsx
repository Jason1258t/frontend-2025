import type { Image } from "@/types";
import React from "react";
import styles from '../Canvas.module.css';

interface ImageContentProps {
    content: Image;
    elementId: string;
}

export const ImageContent: React.FC<ImageContentProps> = ({ content }) => {
    return (
        <img
            src={content.src}
            alt="slide element"
            className={styles.imageElement}
            onClick={(e) => e.stopPropagation()}
        />
    );
};
