import { Plus } from "lucide-react";
import SlidePreview from "./SlidePreview";

import styles from "./Sidebar.module.css";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { generateNewSlide } from "@/utils/defaultObjects";
import {
    addSlide,
    removeSlide,
    setCurrentSlide,
} from "@/store/slices/slidesSlice";

const Sidebar = () => {
    const { slides, currentSlideId } = useAppSelector((state) => state.slides);
    const dispatch = useAppDispatch();

    const handleAddSlide = () => {
        const slide = generateNewSlide();
        dispatch(addSlide(slide));
    };

    const handleSelectSlide = (id: string) => {
        dispatch(setCurrentSlide(id));
    };

    const handleDeleteSlide = (id: string) => {
        dispatch(removeSlide(id));
    };

    return (
        <div className={styles.sidebar}>
            <ol className={styles.slidesList}>
                {slides.map((slide) => (
                    <SlidePreview
                        key={slide.id}
                        slide={slide}
                        isActive={slide.id === currentSlideId}
                        onSelect={() => {
                            handleSelectSlide(slide.id);
                        }}
                        onDelete={() => handleDeleteSlide(slide.id)}
                        canDelete={slides.length > 1}
                    />
                ))}
            </ol>
            <div style={{ padding: "16px" }}>
                <button onClick={handleAddSlide} className={styles.addButton}>
                    <Plus size={20} />
                    Новый слайд
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
