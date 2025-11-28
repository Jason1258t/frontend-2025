import type { Presentation } from "@/types/presentation";
import type { SlideObject, Position } from "../types/slide-content";
import { deepCopy } from "./deepCopy";
import { nanoid } from "nanoid";

export const getZIndexForNewObject = (
  slide: { content: SlideObject[] }
): number => {
  if (slide.content.length === 0) return 1;
  const maxZIndex = Math.max(...slide.content.map((obj) => obj.zIndex));
  return maxZIndex + 1;
};


export const selectElements = (
  presentation: Presentation,
  objectIds: string[]
): Presentation => {
  const newPresentation = deepCopy(presentation);
  newPresentation.objectSelection = {
    id: nanoid(),
    objects: [],
  };

  const currentSlide = newPresentation.slidesCollection.slides.find(
    (s) => s.id === newPresentation.currentSlideId
  );

  for (const objId of objectIds) {
    const obj = currentSlide?.content.find((o) => o.id === objId);
    if (obj) {
      newPresentation.objectSelection.objects.push(deepCopy(obj));
    }
  }

  return newPresentation;
}

export const addContentToSlide = (
  presentation: Presentation,
  payload: { slideId: string; content: SlideObject }
): Presentation => {
  const { slideId, content } = payload;

  const newPresentation = deepCopy(presentation);

  const slide = newPresentation.slidesCollection.slides.find(
    (s) => s.id === slideId
  );
  if (slide) {
    slide.content.push(deepCopy(content));
    newPresentation.updatedAt = new Date();
  }
  return newPresentation;
};

export const removeContentFromSlide = (
  presentation: Presentation,
  payload: { slideId: string; objectId: string }
): Presentation => {
  const { slideId, objectId } = payload;
  const newPresentation = deepCopy(presentation);

  const slide = newPresentation.slidesCollection.slides.find(
    (s) => s.id === slideId
  );
  if (slide) {
    slide.content = slide.content.filter((e) => e.id !== objectId);
    newPresentation.updatedAt = new Date();
  }

  newPresentation.objectSelection = {id: nanoid(), objects: []};

  return newPresentation;
};

export const moveObject = (
  presentation: Presentation,
  slideId: string,
  objectId: string,
  moveTo: Position
): Presentation => {
  const newPresentation = deepCopy(presentation);

  const slide = newPresentation.slidesCollection.slides.find(
    (s) => s.id === slideId
  );
  if (slide) {
    const obj = slide.content.find((e) => e.id === objectId);
    if (obj) {
      obj.position = deepCopy(moveTo);
      newPresentation.updatedAt = new Date();
    }
  }

  return newPresentation;
};
