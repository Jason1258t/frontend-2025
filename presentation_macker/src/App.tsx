import React from "react";
import Sidebar from "./view/Sidebar";
import Toolbar from "./view/Toolbar";
import Canvas from "./view/Canvas";
import PropertiesPanel from "./view/PropertiesPanel";
import type {  SlideObject, TextObject } from "./types";
import type { Presentation } from "@/types/presentation";

import styles from "./App.module.css";
import { dispatch } from "./editor/Editor";
import {
  addContentToSlide,
  getZIndexForNewObject,
  removeContentFromSlide,
  selectElements,
} from "./utils/content";

import { changeTextValue } from "./utils/text";

import {
  createDefaultImageObject,
  createDefaultTextObject,
} from "./utils/defaultObjects";
import { changeTitle } from "./utils/changeTitle";

type AppProps = {
  editor: Presentation;
};

const App: React.FC<AppProps> = ({ editor }) => {
  const slides = editor.slidesCollection.slides;
  const currentSlideId = editor.currentSlideId;
  const selectedElements = editor.objectSelection?.objects ?? null;

  const currentSlide = slides.find((s) => s.id === currentSlideId)!;

  // Callbacks
  const handleAddText = () => {
    const currSlide = editor.currentSlideId;
    if (currSlide) {
      const newText = createDefaultTextObject(
        getZIndexForNewObject(
          editor.slidesCollection.slides.find((s) => s.id === currSlide)!
        )
      );

      dispatch(addContentToSlide, { slideId: currSlide, content: newText });
    }
  };
  const handleAddImage = () => {
    const currSlide = editor.currentSlideId;
    if (currSlide) {
      const newImg = createDefaultImageObject(
        getZIndexForNewObject(
          editor.slidesCollection.slides.find((s) => s.id === currSlide)!
        )
      );

      dispatch(addContentToSlide, { slideId: currSlide, content: newImg });
    }
  };
  const handleDeleteElement = () => {
    if (!selectElements || selectElements.length === 0) return;
    if (!currentSlide) return;

    for (const elem of selectedElements!) {
      dispatch(removeContentFromSlide, {
        slideId: currentSlide.id,
        objectId: elem.id,
      });
    }

    console.log("Delete Element");
  };
  const handleSelectElement = (id: string | null, add: boolean) => {
    console.log("Select Element", id);
    if (add && id) {
      const ids = [...(selectedElements?.map((e) => e.id) || []), id];
      dispatch(selectElements, ids);
    } else if (!add) {
      dispatch(selectElements, id ? [id] : []);
    }
  };
  const handleUpdateElement = (
    elementId: string,
    updates: Partial<SlideObject>
  ) => {
    if (!currentSlide) return;
    if (updates.type == "text") {
      dispatch(changeTextValue, {
        slideId: currentSlide.id,
        objectId: elementId,
        newValue: (updates as Partial<TextObject>).content?.value || "",
      });
      return;
    }
    console.log("Update Element", elementId, updates);
  };
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    console.log("Mouse Down on Element", elementId, "at", e.clientX, e.clientY);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    console.log("Mouse Move", e.clientX, e.clientY);
  };
  const handleMouseUp = () => {
    console.log("Mouse Up");
  };

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <div style={{display: "flex", alignItems: "center"}}>
          <p className={styles.headerTitle}>Название</p>
          <input className={styles.headerInput} value={editor.title} onChange={(e) => {
            let value = e.target.value;
            if (value.length === 0) {
              value = "Новая презентация";
            }
            dispatch(changeTitle, value);
          }}/>
        </div>
      </div>
      <div style={{display: "flex", flex: 1, overflow: "hidden"}}>
        <Sidebar slides={slides} currentSlideId={currentSlideId} />
        <div className={styles.mainArea}>
          <Toolbar
            selectedElement={selectedElements}
            onAddText={handleAddText}
            onAddImage={handleAddImage}
            onDeleteElement={handleDeleteElement}
          />
          <Canvas
            slide={currentSlide}
            selectedElements={selectedElements}
            onSelectElement={handleSelectElement}
            onUpdateElement={handleUpdateElement}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
          {selectedElements && selectedElements.length == 1 && (
            <PropertiesPanel
              element={selectedElements[0]}
              onUpdate={(updates) =>
                handleUpdateElement(selectedElements[0].id, updates)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
