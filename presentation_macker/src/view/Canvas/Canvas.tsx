import styles from "./Canvas.module.css";
import {
    moveObjectOnSlide,
    resizeObjectOnSlide,
    selectCurrentSlide,
    selectCurrentSlideObjects,
    selectElements,
    useAppDispatch,
    useAppSelector,
} from "@/store";
import SlideObjectWidget from "./SlideObjectWidget";
import { ObjectControls } from "./controls";
import { useCanvas } from "./hooks/useCanvas";

const Canvas = () => {
    const dispatch = useAppDispatch();
    const slide = useAppSelector(selectCurrentSlide);
    const elements = useAppSelector(selectCurrentSlideObjects);
    const selectedIds = useAppSelector(
        (state) => state.objects.objectSelection?.objects ?? []
    );

    const {
        canvasRef,
        drag,
        resize,
        handleDragStart,
        handleResizeStart,
        handleMouseMove,
        handleMouseUp,
        getSelectedRectWithOffset,
    } = useCanvas(elements, selectedIds);

    if (!slide) return <h1>No slide</h1>;

    const onMouseUp = () => {
        const { dragResult, resizeResult } = handleMouseUp();

        if (dragResult) {
            for (const id in dragResult) {
                dispatch(
                    moveObjectOnSlide({
                        slideId: slide.id,
                        objectId: id,
                        newPosition: dragResult[id],
                    })
                );
            }
        }

        if (resizeResult) {
            dispatch(
                resizeObjectOnSlide({
                    slideId: slide.id,
                    objectId: resizeResult.id,
                    newPosition: resizeResult.position,
                    newSize: resizeResult.size,
                })
            );
        }
    };

    return (
        <div className={styles.canvasContainer}>
            <div className={styles.canvasWrapper}>
                <div
                    ref={canvasRef}
                    className={styles.canvas}
                    style={{
                        backgroundColor: slide.theme.color,
                        backgroundImage: slide.theme.backgroundImage
                            ? `url(${slide.theme.backgroundImage})`
                            : "none",
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onClick={() => {
                        dispatch(
                            selectElements({
                                slideId: slide.id,
                                objectIds: [],
                                clear: true,
                            })
                        );
                    }}
                >
                    {selectedIds.length > 1 && (
                        <ObjectControls
                            showControls={false}
                            {...getSelectedRectWithOffset(drag.dragOffset)}
                        />
                    )}
                    {elements.map((element) => (
                        <SlideObjectWidget
                            key={element.id}
                            element={element}
                            onMouseDown={handleDragStart}
                            onResizeStart={handleResizeStart}
                            changedSize={
                                resize.resizeData?.id === element.id
                                    ? resize.resizeData.size
                                    : undefined
                            }
                            changedPosition={
                                resize.resizeData?.id === element.id
                                    ? resize.resizeData.position
                                    : drag.dragPositions
                                      ? drag.dragPositions[element.id]
                                      : undefined
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Canvas;
