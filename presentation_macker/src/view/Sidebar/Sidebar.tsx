import { Plus, Trash2 } from "lucide-react";
import React, { useRef } from "react";
import type { Slide } from "@/types";
import SlidePreview from "./SlidePreview";
import DropZoneEnd from "./DropZoneEnd";
import { useSlideDragDrop } from "./hooks/useSlideDragDrop";
import styles from "./Sidebar.module.css";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { generateNewSlide } from "@/utils/defaultObjects";
import {
    addSlide,
    removeSlide,
    setCurrentSlide,
    moveSlidesInOrder,
    toggleSlideSelection,
    clearSlideSelection,
    selectSlides,
} from "@/store/slices/slidesSlice";
import { useSlideSelection } from "./hooks/useSlideSelection";
import { useSlideActions } from "./hooks/useSlideActions";

const Sidebar = () => {
    const { slides, currentSlideId, selectedSlideIds } = useAppSelector(
        (state) => state.slides
    );
    const dispatch = useAppDispatch();

    const endDropZoneRef = useRef<HTMLDivElement>(null);

    const slideDnD = useSlideDragDrop({
        slides,
        selectedSlideIds,
        onMoveSlides: (slideIds: string[], targetIndex: number) => {
            dispatch(moveSlidesInOrder({ slideIds, targetIndex }));
        },
    });

    const { handleSelectSlide } = useSlideSelection({
        slides,
        currentSlideId,
        selectedSlideIds,
        onToggleSelection: (slideId: string) =>
            dispatch(toggleSlideSelection(slideId)),
        onSelectSlides: (slideIds: string[], clear: boolean) =>
            dispatch(selectSlides({ slideIds, clear })),
        onClearSelection: () => dispatch(clearSlideSelection()),
        onSetCurrentSlide: (slideId: string) =>
            dispatch(setCurrentSlide(slideId)),
    });

    const actions = useSlideActions({
        slides,
        selectedSlideIds,
        onAddSlide: (slide: Slide) => dispatch(addSlide(slide)),
        onRemoveSlide: (slideId: string) => dispatch(removeSlide(slideId)),
        onClearSelection: () => dispatch(clearSlideSelection()),
        generateNewSlide,
    });

    // Обработчики для DropZoneEnd
    const handleEndZoneDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        slideDnD.handleDragOver(e, slides.length);
    };

    const handleEndZoneDrop = (e: React.DragEvent) => {
        e.preventDefault();
        slideDnD.handleDrop(e, slides.length);
    };

    return (
        <div
            className={styles.sidebar}
            onClick={() =>
                dispatch(selectSlides({ slideIds: [], clear: true }))
            }
        >
            {selectedSlideIds.length > 0 && (
                <div className={styles.selectedPanel}>
                    <div className={styles.selectedCount}>
                        Выбрано: {selectedSlideIds.length}
                    </div>
                    {actions.canDeleteSelected && (
                        <button
                            onClick={actions.handleDeleteSelected}
                            className={styles.deleteSelectedButton}
                            title="Удалить выбранные"
                        >
                            <Trash2 size={16} />
                            Удалить выбранные
                        </button>
                    )}
                </div>
            )}

            <ol className={styles.slidesList}>
                {slides.map((slide, index) => {
                    const isActive = slide.id === currentSlideId;
                    const isSelected = selectedSlideIds.includes(slide.id);
                    const dragOverPosition =
                        slideDnD.getDragOverPosition(index);

                    return (
                        <React.Fragment key={slide.id}>
                            {slideDnD.dragState.dragOverIndex === index && (
                                <div className={styles.dropIndicatorEnd}></div>
                            )}
                            <SlidePreview
                                slide={slide}
                                index={index}
                                isActive={isActive || isSelected}
                                isSelected={isSelected}
                                canDelete={actions.canDeleteSlide(slide.id)}
                                onSelect={(e) => handleSelectSlide(e, slide.id)}
                                onDelete={() =>
                                    actions.handleDeleteSlide(slide.id)
                                }
                                onDragStart={(e) =>
                                    slideDnD.handleDragStart(e, slide.id)
                                }
                                onDragOver={(e) =>
                                    slideDnD.handleDragOver(e, index)
                                }
                                onDragLeave={slideDnD.handleDragLeave}
                                onDrop={(e) => slideDnD.handleDrop(e, index)}
                                onDragEnd={slideDnD.handleDragEnd}
                                dragOverPosition={dragOverPosition}
                                isDragging={slideDnD.isDragging}
                            />
                        </React.Fragment>
                    );
                })}

                <DropZoneEnd
                    ref={endDropZoneRef}
                    isDragging={slideDnD.isDragging}
                    dragOverIndex={slideDnD.dragState.dragOverIndex}
                    slidesCount={slides.length}
                    onDragOver={handleEndZoneDragOver}
                    onDragLeave={slideDnD.handleDragLeave}
                    onDrop={handleEndZoneDrop}
                />
            </ol>

            <div className={styles.addSlideContainer}>
                <button
                    onClick={actions.handleAddSlide}
                    className={styles.addButton}
                    style={{ marginBottom: 10 }}
                >
                    <Plus size={20} />
                    Новый слайд
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
