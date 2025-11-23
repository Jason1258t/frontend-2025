import React from "react";
import { Plus } from "lucide-react";
import type { Slide } from "@/types";
import SlidePreview from "./SlidePreview";

import styles from "./Sidebar.module.css";

interface SidebarProps {
  slides: Slide[];
  currentSlideIndex: number;
  onAddSlide: () => void;
  onSelectSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  slides,
  currentSlideIndex,
  onAddSlide,
  onSelectSlide,
  onDeleteSlide,
}) => {
  return (
    <div className={styles.sidebar}>
      <div style={{ padding: "16px" }}>
        <button onClick={onAddSlide} className={styles.addButton}>
          <Plus size={20} />
          Новый слайд
        </button>
      </div>
      <div className={styles.slidesList}>
        {slides.map((slide, index) => (
          <SlidePreview
            key={slide.id}
            slide={slide}
            index={index}
            isActive={index === currentSlideIndex}
            onSelect={() => onSelectSlide(index)}
            onDelete={() => onDeleteSlide(index)}
            canDelete={slides.length > 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
