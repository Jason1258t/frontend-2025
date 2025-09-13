import type { SlidesCollection, Slide } from "../types/slide.js";
import type { SlideTheme } from "../types/slide_theme.js";

function addSlide(collection: SlidesCollection, slide: Slide): SlidesCollection {
  let newCollection = { ...collection };
  newCollection.slides.push(slide);
  return newCollection;
}

function removeSlide(collection: SlidesCollection, slideId: string): SlidesCollection {
  let newCollection = { ...collection };
  newCollection.slides.filter((e) => e.id !== slideId);
  return newCollection;
}

function moveSlide(collection: SlidesCollection, slide: Slide, toIndex: number): SlidesCollection {
  let newCollection = { ...collection };
  newCollection.slides.filter((e) => e.id !== slide.id);
  newCollection.slides.splice(toIndex, 0, slide);
  return newCollection;
}

function changeBackground(slide: Slide, background: SlideTheme): Slide {
  return {...slide, theme: background}
}

export { addSlide, removeSlide, moveSlide, changeBackground };