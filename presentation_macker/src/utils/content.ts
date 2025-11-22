import type Presentation from "../types/presentation";
import type { SlideObject, Position } from "../types/slide-content";
import { deepCopy } from "./deepCopy";

export const addContentToSlide = (
  presentation: Presentation, 
  slideId: string, 
  content: SlideObject
): Presentation => {
  const newPresentation = deepCopy(presentation);
  
  const slide = newPresentation.slidesCollection.slides.find(s => s.id === slideId);
  if (slide) {
    slide.content.push(deepCopy(content));
    newPresentation.updatedAt = new Date();
  }
  
  return newPresentation;
};

export const removeContentFromSlide = (
  presentation: Presentation, 
  slideId: string, 
  objectId: string
): Presentation => {
  const newPresentation = deepCopy(presentation);
  
  const slide = newPresentation.slidesCollection.slides.find(s => s.id === slideId);
  if (slide) {
    slide.content = slide.content.filter((e) => e.id !== objectId);
    newPresentation.updatedAt = new Date();
  }
  
  return newPresentation;
};

export const moveObject = (
  presentation: Presentation, 
  slideId: string, 
  objectId: string, 
  moveTo: Position
): Presentation => {
  const newPresentation = deepCopy(presentation);
  
  const slide = newPresentation.slidesCollection.slides.find(s => s.id === slideId);
  if (slide) {
    const obj = slide.content.find((e) => e.id === objectId);
    if (obj) {
      obj.position = deepCopy(moveTo);
      newPresentation.updatedAt = new Date();
    }
  }
  
  return newPresentation;
};