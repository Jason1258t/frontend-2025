import type { TextObject, ImageObject } from "@/types";
import { nanoid } from "nanoid";

import { SLIDE_WIDTH, SLIDE_HEIGHT, TEXT_RECT, IMAGE_RECT } from "@/types";

export const createDefaultTextObject = (zIndex: number): TextObject => {
  const newText: TextObject = {
    id: nanoid(),
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
      id: nanoid(),
    },
    zIndex: zIndex,
  };

  return newText;
};

export const createDefaultImageObject = (zIndex: number): ImageObject => {
  const newImg: ImageObject = {
    id: nanoid(),
    type: "image",
    position: {
        x: (SLIDE_WIDTH - IMAGE_RECT.width) / 2,
        y: (SLIDE_HEIGHT - IMAGE_RECT.height) / 2,
    },
    rect: IMAGE_RECT,
    content: {
      src: "https://i.pinimg.com/474x/80/23/85/8023856040e1c2a8a416054c81ee256e.jpg",
      id: nanoid(),
    },
    zIndex: zIndex,
  };

  return newImg;
};
