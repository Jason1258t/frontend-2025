import type { SlideObject } from "./slide-content";
import type { SlideTheme } from "./slide-theme";

export const SLIDE_WIDTH = 960;
export const SLIDE_HEIGHT = 540;

type Slide = {
  id: string;
  theme: SlideTheme;
  content: SlideObject[];
}

type SlidesCollection = {
  id: string;
  slides: Slide[];
}

export type { Slide, SlidesCollection };