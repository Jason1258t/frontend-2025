import type { SlideObject } from "@/types";

export const getZIndexForNewObject = (content: SlideObject[]): number => {
    if (content.length === 0) return 1;
    const maxZIndex = Math.max(...content.map((obj) => obj.zIndex));
    return maxZIndex + 1;
};
