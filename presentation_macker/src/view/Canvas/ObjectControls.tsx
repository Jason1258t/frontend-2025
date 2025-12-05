import type { Position, Size } from "@/types";
import ResizeControls from "./ResizeControls";
import type { ResizeType } from "./resize";

interface ObjectControlsProps {
    position: Position;
    rect: Size;
    onResizeStart?: (e: React.MouseEvent, type: ResizeType) => void;
    showAllControls?: boolean;
}

const ObjectControls: React.FC<ObjectControlsProps> = ({
    position,
    rect,
    onResizeStart,
    showAllControls = true,
}) => {
    const controlSize = 6;

    // Определяем, какие контролы показывать
    const controlTypes: Array<"nw" | "ne" | "sw" | "se"> = [
        "nw",
        "ne",
        "sw",
        "se",
    ];

    // Если нужны все 8 контролов (включая боковые)
    const allControlTypes: Array<
        "nw" | "ne" | "sw" | "se" | "n" | "s" | "w" | "e"
    > = showAllControls
        ? ["nw", "ne", "sw", "se", "n", "s", "w", "e"]
        : ["nw", "ne", "sw", "se"];

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
            <ResizeControls
                position={position}
                rect={rect}
                controlSize={controlSize}
                controls={showAllControls ? allControlTypes : controlTypes}
                onResizeStart={onResizeStart}
            />
        </>
    );
};

export default ObjectControls;
