import React from "react";
import type { ResizeType } from "./resize";

interface ResizeControlProps {
    type: ResizeType;
    position: { x: number; y: number };
    rect: { width: number; height: number };
    size?: number;
    onMouseDown?: (e: React.MouseEvent, type: ResizeType) => void;
}

const ResizeControl: React.FC<ResizeControlProps> = ({
    type,
    position,
    rect,
    size = 8,
    onMouseDown,
}) => {
    const getControlStyle = () => {
        const baseStyle = {
            position: "absolute" as const,
            width: size,
            height: size,
            background: "#aeaeae",
            border: "1px solid black",
            zIndex: 10,
        };

        switch (type) {
            case "nw": // top-left
                return {
                    ...baseStyle,
                    left: position.x - size,
                    top: position.y - size,
                    cursor: "nw-resize",
                };
            case "ne": // top-right
                return {
                    ...baseStyle,
                    left: position.x + rect.width + 2,
                    top: position.y - size,
                    cursor: "ne-resize",
                };
            case "sw": // bottom-left
                return {
                    ...baseStyle,
                    left: position.x - size,
                    top: position.y + rect.height + 2,
                    cursor: "sw-resize",
                };
            case "se": // bottom-right
                return {
                    ...baseStyle,
                    left: position.x + rect.width + 2,
                    top: position.y + rect.height + 2,
                    cursor: "se-resize",
                };
            case "n": // top
                return {
                    ...baseStyle,
                    left: position.x + rect.width / 2 - size / 2,
                    top: position.y - size,
                    cursor: "n-resize",
                };
            case "s": // bottom
                return {
                    ...baseStyle,
                    left: position.x + rect.width / 2 - size / 2,
                    top: position.y + rect.height + 2,
                    cursor: "s-resize",
                };
            case "w": // left
                return {
                    ...baseStyle,
                    left: position.x - size,
                    top: position.y + rect.height / 2 - size / 2,
                    cursor: "w-resize",
                };
            case "e": // right
                return {
                    ...baseStyle,
                    left: position.x + rect.width + 2,
                    top: position.y + rect.height / 2 - size / 2,
                    cursor: "e-resize",
                };
            default:
                return baseStyle;
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onMouseDown) {
            onMouseDown(e, type);
        }
    };

    return (
        <div
            style={getControlStyle()}
            onMouseDown={handleMouseDown}
            data-resize-type={type}
        />
    );
};

export default ResizeControl;
