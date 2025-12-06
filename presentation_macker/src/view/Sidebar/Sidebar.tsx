import { Plus, Trash2 } from "lucide-react";
import SlidePreview from "./SlidePreview";
import { useSlideDragDrop } from "./useSlideDragDrop";
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
import { useCallback, useRef } from "react";
import React from "react";

const Sidebar = () => {
    const { slides, currentSlideId, selectedSlideIds } = useAppSelector(
        (state) => state.slides
    );
    const dispatch = useAppDispatch();

    const endDropZoneRef = useRef<HTMLDivElement>(null);

    const handleMoveSlides = useCallback(
        (slideIds: string[], targetIndex: number) => {
            dispatch(moveSlidesInOrder({ slideIds, targetIndex }));
        },
        [dispatch]
    );

    const {
        dragState,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd,
        isDragging,
        getDragOverPosition,
    } = useSlideDragDrop({
        slides,
        selectedSlideIds,
        onMoveSlides: handleMoveSlides,
    });

    const handleSelectSlide = useCallback(
        (e: React.MouseEvent, slideId: string) => {
            e.stopPropagation();
            if (e.ctrlKey || e.metaKey) {
                dispatch(toggleSlideSelection(slideId));
            } else if (e.shiftKey) {
                const currentIndex = slides.findIndex(
                    (s) => s.id === currentSlideId
                );
                const targetIndex = slides.findIndex((s) => s.id === slideId);

                if (currentIndex !== -1) {
                    const start = Math.min(currentIndex, targetIndex);
                    const end = Math.max(currentIndex, targetIndex);
                    const slideIds = slides
                        .slice(start, end + 1)
                        .map((s) => s.id);

                    const newIds = slideIds.filter(
                        (id) => !selectedSlideIds.includes(id)
                    );
                    if (newIds.length > 0) {
                        dispatch(
                            selectSlides({ slideIds: newIds, clear: false })
                        );
                    }
                }
            } else {
                dispatch(clearSlideSelection());
                dispatch(setCurrentSlide(slideId));
            }
        },
        [dispatch, slides, currentSlideId, selectedSlideIds]
    );

    const canDeleteSelected =
        selectedSlideIds.length > 0 &&
        selectedSlideIds.length !== slides.length;
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
                    {canDeleteSelected && (
                        <button
                            onClick={() => {
                                if (selectedSlideIds.length === 0) return;

                                selectedSlideIds.forEach((slideId) => {
                                    dispatch(removeSlide(slideId));
                                });

                                dispatch(clearSlideSelection());
                            }}
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
                    const dragOverPosition = getDragOverPosition(index);

                    return (
                        <>
                            {dragState.dragOverIndex === index && (
                                <div className={styles.dropIndicatorEnd}></div>
                            )}
                            <SlidePreview
                                slide={slide}
                                index={index}
                                isActive={isActive || isSelected}
                                isSelected={isSelected}
                                canDelete={slides.length > 1}
                                onSelect={(e) => handleSelectSlide(e, slide.id)}
                                onDelete={() => {
                                    if (selectedSlideIds.includes(slide.id)) {
                                        dispatch(clearSlideSelection());
                                    }
                                    dispatch(removeSlide(slide.id));
                                }}
                                onDragStart={(e) =>
                                    handleDragStart(e, slide.id)
                                }
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                dragOverPosition={dragOverPosition}
                                isDragging={isDragging}
                            />
                        </>
                    );
                })}

                {isDragging && (
                    <div
                        ref={endDropZoneRef}
                        className={styles.dropZoneEnd}
                        onDragOver={(e: React.DragEvent) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                            handleDragOver(e, slides.length);
                        }}
                        onDragLeave={handleDragLeave}
                        onDrop={(e: React.DragEvent) => {
                            e.preventDefault();
                            handleDrop(e, slides.length);
                        }}
                        style={{
                            display: "block",
                            minHeight: "100px",
                            border: "2px dashed transparent",
                            borderRadius: "8px",
                            margin: "4px 0",
                            transition: "border-color 0.2s",
                        }}
                    >
                        {dragState.dragOverIndex === slides.length && (
                            <div className={styles.dropIndicatorEnd} />
                        )}
                        <div
                            style={{
                                padding: "16px",
                                color: "#6b7280",
                                fontSize: "14px",
                                textAlign: "center",
                            }}
                        >
                            Переместить в конец
                        </div>
                    </div>
                )}
            </ol>

            <div className={styles.addSlideContainer}>
                <button
                    onClick={() => {
                        const slide = generateNewSlide();
                        dispatch(addSlide(slide));
                        dispatch(clearSlideSelection());
                    }}
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
