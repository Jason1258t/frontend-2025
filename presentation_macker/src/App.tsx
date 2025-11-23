import React, { useState } from "react";
import Sidebar from "./view/Sidebar";
import Toolbar from "./view/Toolbar";
import Canvas from "./view/Canvas";
import PropertiesPanel from "./view/PropertiesPanel";
import type { Slide, SlideObject } from "./types";

import styles from "./App.module.css";

const App: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: "1",
      content: [
        {
          id: "e1",
          type: "text",
          content: {
            id: "t1",
            value: "Welcome to Presentation Maker",
            fontFamily: "Arial",
            fontSize: 48,
            color: "#1f2937",
          },
          position: { x: 100, y: 100 },
          rect: { width: 400, height: 100 },
          zIndex: 1,
        },
      ],
      theme: { id: "default", color: "#f3f4f6", backgroundImage: null },
      preview: "",
    },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const currentSlide = slides[currentSlideIndex];
  const selectedEl = currentSlide.content.find(
    (el) => el.id === selectedElement
  );

  // Callbacks
  const handleAddSlide = () => {
    console.log("Add Slide");
  };
  const handleSelectSlide = (index: number) => {
    console.log("Select Slide", index);
  };
  const handleDeleteSlide = (index: number) => {
    console.log("Delete Slide", index);
  };
  const handleAddText = () => {
    console.log("Add Text");
  };
  const handleAddImage = () => {
    console.log("Add Image");
  };
  const handleDeleteElement = () => {
    console.log("Delete Element");
  };
  const handleSelectElement = (id: string | null) => {
    console.log("Select Element", id);
  };
  const handleUpdateElement = (
    elementId: string,
    updates: Partial<SlideObject>
  ) => {
    console.log("Update Element", elementId, updates);
  };
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    console.log("Mouse Down on Element", elementId);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    console.log("Mouse Move", e.clientX, e.clientY);
  };
  const handleMouseUp = () => {
    console.log("Mouse Up");
  };

  return (
    <div className={styles.app}>
      <Sidebar
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        onAddSlide={handleAddSlide}
        onSelectSlide={handleSelectSlide}
        onDeleteSlide={handleDeleteSlide}
      />
      <div className={styles.mainArea}>
        <Toolbar
          selectedElement={selectedElement}
          onAddText={handleAddText}
          onAddImage={handleAddImage}
          onDeleteElement={handleDeleteElement}
        />
        <Canvas
          slide={currentSlide}
          selectedElement={selectedElement}
          onSelectElement={handleSelectElement}
          onUpdateElement={handleUpdateElement}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        {selectedEl && (
          <PropertiesPanel
            element={selectedEl}
            onUpdate={(updates) => handleUpdateElement(selectedEl.id, updates)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
