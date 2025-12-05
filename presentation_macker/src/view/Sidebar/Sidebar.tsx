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
import { useCallback } from "react";

const Sidebar = () => {
    const { slides, currentSlideId, selectedSlideIds } = useAppSelector(
        (state) => state.slides
    );
    const dispatch = useAppDispatch();

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

    const handleAddSlide = () => {
        const slide = generateNewSlide();
        dispatch(addSlide(slide));
        dispatch(clearSlideSelection());
    };

    const handleSelectSlide = useCallback(
        (e: React.MouseEvent, slideId: string) => {
            e.stopPropagation();
            if (e.ctrlKey || e.metaKey) {
                // Ctrl/Cmd + клик - добавляем/убираем из выделения
                dispatch(toggleSlideSelection(slideId));
            } else if (e.shiftKey) {
                // Shift + клик - диапазонное выделение
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

                    // Добавляем только те, которых еще нет в выделении
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
                // Обычный клик - выделяем только этот слайд
                dispatch(clearSlideSelection());
                dispatch(setCurrentSlide(slideId));
            }
        },
        [dispatch, slides, currentSlideId, selectedSlideIds]
    );

    const handleDeleteSlide = useCallback(
        (slideId: string) => {
            if (selectedSlideIds.includes(slideId)) {
                dispatch(clearSlideSelection());
            }
            dispatch(removeSlide(slideId));
        },
        [dispatch, selectedSlideIds]
    );

    const handleDeleteSelected = useCallback(() => {
        if (selectedSlideIds.length === 0) return;

        // Удаляем все выделенные слайды
        selectedSlideIds.forEach((slideId) => {
            dispatch(removeSlide(slideId));
        });

        // Снимаем выделение
        dispatch(clearSlideSelection());
    }, [dispatch, selectedSlideIds]);

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
            {canDeleteSelected && (
                <div className={styles.selectedPanel}>
                    <div className={styles.selectedCount}>
                        Выбрано: {selectedSlideIds.length}
                    </div>
                    <button
                        onClick={handleDeleteSelected}
                        className={styles.deleteSelectedButton}
                        title="Удалить выбранные"
                    >
                        <Trash2 size={16} />
                        Удалить выбранные
                    </button>
                </div>
            )}

            <ol className={styles.slidesList}>
                {slides.map((slide, index) => {
                    const isActive = slide.id === currentSlideId;
                    const isSelected = selectedSlideIds.includes(slide.id);
                    const dragOverPosition = getDragOverPosition(index);

                    return (
                        <div>
                            {dragState.dragOverIndex === index && (
                                <div
                                    style={{
                                        width: "100%",
                                        height: 2,
                                        margin: "10px 0",
                                        background: "blue",
                                    }}
                                ></div>
                            )}
                            <SlidePreview
                                key={slide.id}
                                slide={slide}
                                index={index}
                                isActive={isActive || isSelected}
                                isSelected={isSelected}
                                canDelete={slides.length > 1}
                                onSelect={(e) => handleSelectSlide(e, slide.id)}
                                onDelete={() => handleDeleteSlide(slide.id)}
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
                        </div>
                    );
                })}
            </ol>

            <div className={styles.addSlideContainer}>
                <button onClick={handleAddSlide} className={styles.addButton} style={{marginBottom: 10}}>
                    <Plus size={20} />
                    Новый слайд
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
