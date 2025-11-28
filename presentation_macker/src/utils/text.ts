import type { Presentation } from "../types/presentation";
import type { Text } from "../types/slide-content";
import { deepCopy } from "./deepCopy";

export const changeTextValue = (
  presentation: Presentation,
  payload: {
    slideId: string;
    objectId: string;
    newValue: string;
  }
): Presentation => {
  const { slideId, objectId, newValue } = payload;

  const newPresentation = deepCopy(presentation);

  const slide = newPresentation.slidesCollection.slides.find(
    (s) => s.id === slideId
  );
  if (slide) {
    const obj = slide.content.find((o) => o.id === objectId);
    if (obj && "value" in obj.content) {
      (obj.content as Text).value = newValue;
      newPresentation.updatedAt = new Date();
    }
  }

  return newPresentation;
};

export const changeFontSize = (
  presentation: Presentation,
  slideId: string,
  objectId: string,
  size: number
): Presentation => {
  const newPresentation = deepCopy(presentation);

  const slide = newPresentation.slidesCollection.slides.find(
    (s) => s.id === slideId
  );
  if (slide) {
    const obj = slide.content.find((o) => o.id === objectId);
    if (obj && "fontSize" in obj.content) {
      (obj.content as Text).fontSize = size;
      newPresentation.updatedAt = new Date();
    }
  }

  return newPresentation;
};

export const changeFontFamily = (
  presentation: Presentation,
  slideId: string,
  objectId: string,
  fontFamily: string
): Presentation => {
  const newPresentation = deepCopy(presentation);

  const slide = newPresentation.slidesCollection.slides.find(
    (s) => s.id === slideId
  );
  if (slide) {
    const obj = slide.content.find((o) => o.id === objectId);
    if (obj && "fontFamily" in obj.content) {
      (obj.content as Text).fontFamily = fontFamily;
      newPresentation.updatedAt = new Date();
    }
  }

  return newPresentation;
};
