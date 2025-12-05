import type { TextObject, ImageObject, Slide } from "@/types";

import { SLIDE_WIDTH, SLIDE_HEIGHT, TEXT_RECT, IMAGE_RECT } from "@/types";
import { generateId } from "./generateId";

export const createDefaultTextObject = (zIndex: number): TextObject => {
    const newText: TextObject = {
        id: generateId(),
        type: "text",
        position: {
            x: (SLIDE_WIDTH - TEXT_RECT.width) / 2,
            y: (SLIDE_HEIGHT - TEXT_RECT.height) / 2,
        },
        rect: TEXT_RECT,
        content: {
            value: "New Text",
            fontSize: 16,
            color: "#000000",
            fontFamily: "Arial",
        },
        zIndex: zIndex,
    };

    return newText;
};

export const createDefaultImageObject = (zIndex: number): ImageObject => {
    const newImg: ImageObject = {
        id: generateId(),
        type: "image",
        position: {
            x: (SLIDE_WIDTH - IMAGE_RECT.width) / 2,
            y: (SLIDE_HEIGHT - IMAGE_RECT.height) / 2,
        },
        rect: IMAGE_RECT,
        content: {
            src: "https://i.pinimg.com/736x/82/04/93/820493a83e8147973bd6bc1eb3936b99.jpg",
        },
        zIndex: zIndex,
    };

    return newImg;
};

export const generateNewSlide = () => {
    const id = generateId();
    const newSlide: Slide = {
        id,
        content: [],
        theme: {
            color: "#ffffff",
            id: "1",
            backgroundImage: null,
        },
    };

    return newSlide;
};
