import type { Position, Size } from "@/types";
import ResizeControls from "./ResizeControls";
import type { ResizeType } from "../hooks/";

interface ObjectControlsProps {
    position: Position;
    rect: Size;
    onResizeStart?: (e: React.MouseEvent, type: ResizeType) => void;
    showControls?: boolean;
}

export const ObjectControls: React.FC<ObjectControlsProps> = ({
    position,
    rect,
    onResizeStart,
    showControls = true,
}) => {
    const controlSize = 6;

    const allControlTypes: Array<ResizeType> = [
        "nw",
        "ne",
        "sw",
        "se",
        "n",
        "s",
        "w",
        "e",
    ];

    return (
        <>
            {/* Контур выделения */}
            <div
                style={{
                    position: "absolute",
                    top: position.y - 2,
                    left: position.x - 2,
                    width: rect.width + 4,
                    height: rect.height + 4,
                    border: "2px solid blue",
                    pointerEvents: "none",
                }}
            ></div>

            {/* Элементы изменения размера */}
            {showControls && (
                <ResizeControls
                    position={position}
                    rect={rect}
                    controlSize={controlSize}
                    controls={allControlTypes}
                    onResizeStart={onResizeStart}
                />
            )}
        </>
    );
};

export default ObjectControls;
