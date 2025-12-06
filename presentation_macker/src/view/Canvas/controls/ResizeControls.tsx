import React from "react";
import ResizeControl from "./ResizeControl";
import type { ResizeType } from "../hooks/";

interface ResizeControlsProps {
    position: { x: number; y: number };
    rect: { width: number; height: number };
    controlSize?: number;
    controls?: Array<ResizeType>;
    onResizeStart?: (e: React.MouseEvent, type: ResizeType) => void;
}

export const ResizeControls: React.FC<ResizeControlsProps> = ({
    position,
    rect,
    controlSize = 8,
    controls = ["nw", "ne", "sw", "se", "n", "s", "w", "e"],
    onResizeStart,
}) => {
    const handleMouseDown = (e: React.MouseEvent, type: ResizeType) => {
        if (onResizeStart) {
            onResizeStart(e, type);
        }
    };

    return (
        <>
            {controls.map((controlType) => (
                <ResizeControl
                    key={controlType}
                    type={controlType}
                    position={position}
                    rect={rect}
                    size={controlSize}
                    onMouseDown={handleMouseDown}
                />
            ))}
        </>
    );
};

export default ResizeControls;
