import type { Position, Size } from "@/types";

type ResizeType = "nw" | "ne" | "sw" | "se" | "n" | "s" | "w" | "e";

interface ResizeData {
    startSize: any;
    id: string;
    position: Position;
    size: Size;
    startPoint: Position;
    startPos: Position;
    type: ResizeType;
}

export { type ResizeData, type ResizeType };
