import type Presentation from "../types/presentation";
import type { Slide } from "../types/slide";
import type { SlideTheme } from "../types/slide-theme";
import { deepCopy } from "./deepCopy";

export const addSlide = (
  presentation: Presentation,
  slide: Slide
): Presentation => {
  const newPresentation = deepCopy(presentation);
  newPresentation.slidesCollection.slides.push(deepCopy(slide));
  newPresentation.updatedAt = new Date();
  return newPresentation;
};

export const removeSlide = (
  presentation: Presentation,
  slideId: string
): Presentation => {
  const newPresentation = deepCopy(presentation);
  newPresentation.slidesCollection.slides =
    newPresentation.slidesCollection.slides.filter((e) => e.id !== slideId);

  if (newPresentation.currentSlideId === slideId) {
    newPresentation.currentSlideId =
      newPresentation.slidesCollection.slides.length > 0
        ? newPresentation.slidesCollection.slides[0].id
        : null;
  }

  newPresentation.updatedAt = new Date();
  return newPresentation;
};

export const moveSlide = (
  presentation: Presentation,
  slideId: string,
  toIndex: number
): Presentation => {
  const newPresentation = deepCopy(presentation);
  const slides = newPresentation.slidesCollection.slides;

  const fromIndex = slides.findIndex((s) => s.id === slideId);
  if (fromIndex === -1) return newPresentation;

  const [slide] = slides.splice(fromIndex, 1);
  slides.splice(toIndex, 0, slide);

  newPresentation.updatedAt = new Date();
  return newPresentation;
};

export const changeBackground = (
  presentation: Presentation,
  slideId: string,
  background: SlideTheme
): Presentation => {
  const newPresentation = deepCopy(presentation);

  const slide = newPresentation.slidesCollection.slides.find(
    (s) => s.id === slideId
  );
  if (slide) {
    slide.theme = deepCopy(background);
    newPresentation.updatedAt = new Date();
  }

  return newPresentation;
};
