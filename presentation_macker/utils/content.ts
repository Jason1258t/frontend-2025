import type { Slide } from "../types/slide.js";
import type { SlideObject, Position } from "../types/slide_content.js";

function addContentToSlide(slide: Slide, content: SlideObject): Slide {
  return {
    ...slide,
    content: [
      ...slide.content,
      content
    ]
  };
}

function removeContentFromSlide(slide: Slide, objectId: string): Slide {
  return {
    ...slide,
    content: slide.content.filter((e) => e.id !== objectId)
  };
}

function moveObject(slide: Slide, objectId: string, moveTo: Position): Slide {
  return {
    ...slide,
    content: slide.content.map((e) => {
      if (e.id !== objectId) return e;
      return { ...e, position: moveTo };
    })
  }
}

export { addContentToSlide, removeContentFromSlide, moveObject }