import type Presentation from "../types/presentation";
import type { Slide, SlidesCollection } from "../types/slide";
import type { SlideObject, Text, Image } from "../types/slide-content";
import type { SlideTheme } from "../types/slide-theme";
import type { ObjectSelection, SlideSelection } from "../types/selection";

// Минимальные тестовые данные
export const createMinimalPresentation = (): Presentation => {
  const minimalSlide: Slide = {
    id: "minimal-slide-1",
    preview: "",
    theme: {
      id: "minimal-theme-1",
      color: "#FFFFFF",
      backgroundImage: ""
    },
    content: []
  };

  const minimalSlidesCollection: SlidesCollection = {
    id: "minimal-collection",
    slides: [minimalSlide]
  };

  return {
    id: "minimal-presentation",
    title: "Minimal Presentation",
    author: "Test Author",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    currentSlideId: "minimal-slide-1",
    slidesCollection: minimalSlidesCollection,
    slideSelection: null,
    objectSelection: null
  };
};

// Максимальные тестовые данные
export const createMaximalPresentation = (): Presentation => {
  const textObject1: Text = {
    id: "text-1",
    value: "Hello World",
    fontFamily: "Arial",
    fontSize: 16,
    color: "#000000"
  };

  const textObject2: Text = {
    id: "text-2",
    value: "Second Text",
    fontFamily: "Helvetica",
    fontSize: 24,
    color: "#FF0000"
  };

  const imageObject1: Image = {
    id: "image-1",
    src: "image1.jpg"
  };

  const imageObject2: Image = {
    id: "image-2",
    src: "image2.png"
  };

  const slideObject1: SlideObject = {
    id: "object-1",
    content: textObject1,
    position: { x: 10, y: 20 },
    zIndex: 1,
    rect: { width: 100, height: 50 }
  };

  const slideObject2: SlideObject = {
    id: "object-2",
    content: textObject2,
    position: { x: 50, y: 100 },
    zIndex: 2,
    rect: { width: 150, height: 75 }
  };

  const slideObject3: SlideObject = {
    id: "object-3",
    content: imageObject1,
    position: { x: 200, y: 50 },
    zIndex: 3,
    rect: { width: 300, height: 200 }
  };

  const slideObject4: SlideObject = {
    id: "object-4",
    content: imageObject2,
    position: { x: 100, y: 150 },
    zIndex: 4,
    rect: { width: 250, height: 150 }
  };

  const slide1: Slide = {
    id: "slide-1",
    preview: "preview1.jpg",
    theme: {
      id: "theme-1",
      color: "#FFFFFF",
      backgroundImage: "bg1.jpg"
    },
    content: [slideObject1, slideObject2]
  };

  const slide2: Slide = {
    id: "slide-2",
    preview: "preview2.jpg",
    theme: {
      id: "theme-2",
      color: "#F0F0F0",
      backgroundImage: "bg2.jpg"
    },
    content: [slideObject3, slideObject4]
  };

  const objectSelection: ObjectSelection = {
    id: "object-selection-1",
    objects: [slideObject1, slideObject3]
  };

  const slideSelection: SlideSelection = {
    id: "slide-selection-1",
    slides: ["slide-1", "slide-2"]
  };

  const maximalSlidesCollection: SlidesCollection = {
    id: "maximal-collection",
    slides: [slide1, slide2]
  };

  return {
    id: "maximal-presentation",
    title: "Maximal Presentation",
    description: "This is a detailed presentation with all features",
    author: "Test Author Pro",
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2023-12-01"),
    currentSlideId: "slide-1",
    slidesCollection: maximalSlidesCollection,
    slideSelection: slideSelection,
    objectSelection: objectSelection
  };
};

// Тестовые объекты для функций
export const createTestSlide = (): Slide => ({
  id: "test-slide",
  preview: "test-preview.jpg",
  theme: {
    id: "test-theme",
    color: "#FFFFFF",
    backgroundImage: "test-bg.jpg"
  },
  content: []
});

export const createTestTextObject = (): SlideObject => ({
  id: "test-text-object",
  content: {
    id: "test-text",
    value: "Test Text",
    fontFamily: "Arial",
    fontSize: 16,
    color: "#000000"
  },
  position: { x: 0, y: 0 },
  zIndex: 1,
  rect: { width: 100, height: 50 }
});

export const createTestImageObject = (): SlideObject => ({
  id: "test-image-object",
  content: {
    id: "test-image",
    src: "test-image.jpg"
  },
  position: { x: 50, y: 50 },
  zIndex: 2,
  rect: { width: 200, height: 150 }
});

export const createTestTheme = (): SlideTheme => ({
  id: "test-theme",
  color: "#FF0000",
  backgroundImage: "new-bg.jpg"
});