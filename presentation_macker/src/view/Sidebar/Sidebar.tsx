import React from "react";
import { Plus } from "lucide-react";
import type { Slide } from "@/types";
import SlidePreview from "./SlidePreview";

import styles from "./Sidebar.module.css";

import { nanoid } from "nanoid";
import { dispatch } from "@/editor/Editor";
import { addSlide, selectSlide, removeSlide } from "@/utils/slides";

interface SidebarProps {
  slides: Slide[];
  currentSlideId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ slides, currentSlideId }) => {
  const handleAddSlide = () => {
    const id = nanoid();
    const newSlide: Slide = {
      id,
      content: [],
      theme: {
        color: "#ffffff",
        id: "1",
        backgroundImage: null,
      },
    };
    dispatch(addSlide, newSlide);
  };

  const handleSelectSlide = (id: string) => {
    dispatch(selectSlide, id);
  };

  const handleDeleteSlide = (id: string) => {
    dispatch(removeSlide, id);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.slidesList}>
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
      </div>
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
